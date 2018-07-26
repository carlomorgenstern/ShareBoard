import { User, UserWithPassword } from '../../../shared/models/user';

import { UserDbMongo } from './user.mongodb.db';

let dbPromise: Promise<IUserDb> | undefined;
export async function getUserDb(): Promise<IUserDb> {
  if (dbPromise === undefined) {
    const db = new UserDbMongo();
    dbPromise = db.setup().then(() => db);
  }

  return dbPromise;
}

export interface IUserDb {
  setup(): Promise<void>;
  getUsers(): Promise<User[]>;
  getUserNames(startsWith?: string): Promise<string[]>;
  createUser(user: UserWithPassword): Promise<boolean>;
  getUser(userId: string): Promise<User | undefined>;
  updateUser(user: User): Promise<boolean>;
  deleteUser(userId: string): Promise<boolean>;
  getUserByName(name: string): Promise<User | undefined>;
  getPasswordByName(name: string): Promise<string | undefined>;
  updatePassword(userId: string, password: string): Promise<boolean>;
}
