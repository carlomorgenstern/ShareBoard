import escapeRegex from 'escape-string-regexp';

import { deserializeUser, isIUser, IUser, User, UserWithPassword } from '../../../shared/models/user';

import { IMongoId, MongoDb } from '../../configuration/database.mongodb';
import { IUserDb } from './user.db';

const userCollection = 'users';

export class UserDbMongo implements IUserDb {
  async setup(): Promise<void> {
    const collection = await MongoDb.getCollection(userCollection);

    await collection.createIndex({
      name: 1,
    }, {
      unique: true,
    });
  }

  async getUsers(): Promise<User[]> {
    const collection = await MongoDb.getCollection(userCollection);

    const iUsers = await collection.find<IUser & IMongoId>({}).toArray();

    return iUsers.reduce<User[]>((users, iUser) => {
      if (!isIUser(iUser)) return users;

      users.push(deserializeUser(iUser));

      return users;
    }, []);
  }

  async getUserNames(startsWith?: string): Promise<string[]> {
    const collection = await MongoDb.getCollection(userCollection);

    // tslint:disable-next-line:deprecation - find is wrongly deprecated in typings
    const users = await collection.find<{_id: string; name: string}>({
      name: {
        $options: 'i',
        $regex: '^' + (startsWith === undefined ? '' : escapeRegex(startsWith)),
      },
    }, {
      projection: {
        name: 1,
      },
    }).toArray();

    return users.map(user => user.name);
  }

  async createUser(user: UserWithPassword): Promise<boolean> {
    const collection = await MongoDb.getCollection(userCollection);

    return collection.insertOne(MongoDb.transformInterface(user))
      .then(() => true)
      .catch((error: {[key: string]: any}) => {
        if (error.code === 11000) return false; // duplicate key error, name is not unique
        else throw error;
      });
  }

  async getUser(id: string): Promise<User | undefined> {
    const collection = await MongoDb.getCollection(userCollection);

    const user = await collection.findOne<IUser & IMongoId>({
      _id: id,
    });

    if (!isIUser(user)) return undefined;

    return deserializeUser(user);
  }

  async updateUser(user: User): Promise<boolean> {
    const collection = await MongoDb.getCollection(userCollection);

    return collection.updateOne({
      _id: user.id,
    }, {
      $set: MongoDb.transformInterface(user),
    }).then(updateResult => {
      return updateResult.modifiedCount !== 0;
    });
  }

  async deleteUser(userId: string): Promise<boolean> {
    const collection = await MongoDb.getCollection(userCollection);

    return collection.deleteOne({
      _id: userId,
    }).then(deleteResult => {
      return deleteResult.deletedCount !== 0;
    });
  }

  async getUserByName(name: string): Promise<User | undefined> {
    const collection = await MongoDb.getCollection(userCollection);

    const user = await collection.findOne<IUser & IMongoId>({
      name,
    });

    if (!isIUser(user)) return undefined;

    return deserializeUser(user);
  }

  async getPasswordByName(name: string): Promise<string | undefined> {
    const collection = await MongoDb.getCollection(userCollection);

    const userPassword = await collection.findOne<{[key: string]: any}>({
      name,
    }, {
      projection: {
        password: 1,
      },
    });

    if (userPassword === null || typeof userPassword.password !== 'string') return undefined;

    return userPassword.password;
  }

  async updatePassword(userId: string, password: string): Promise<boolean> {
    const collection = await MongoDb.getCollection(userCollection);

    return collection.updateOne({
      _id: userId,
    }, {
      $set: {
        password,
      },
    }).then(updateResult => {
      return updateResult.modifiedCount !== 0;
    });
  }
}
