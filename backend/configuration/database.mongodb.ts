import { Collection, Db, MongoClient } from 'mongodb';
import { Database } from './database';

export interface IMongoId {
  _id: string;
}

export class MongoDb extends Database {
  static client: Promise<MongoClient> | undefined;

  static async setup(connectionUri: string): Promise<MongoClient> {
    const client = MongoClient.connect(connectionUri, {
      minSize: 2,
      poolSize: 10,
      ssl: true,
      useNewUrlParser: true,
    });
    MongoDb.client = client;

    return client;
  }

  static async getClient(): Promise<MongoClient> {
    if (MongoDb.client === undefined) throw new Error('Database client was not set up before usae');

    return MongoDb.client;
  }

  static async getDb(): Promise<Db> {
    return (await MongoDb.getClient()).db();
  }

  static async getCollection(collectionName: string): Promise<Collection> {
    return (await MongoDb.getDb()).collection(collectionName);
  }

  static transformInterface<T extends {id: string}>(data: T): T & IMongoId {
    const result: any = {
      _id: data.id,
      ...(data as object),
    };

    return result as T & IMongoId;
  }
}
