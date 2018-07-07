import { MongoDb } from './database.mongodb';
import { processEnvironment } from './environment';

export async function setupDatabase(): Promise<void> {
  await MongoDb.setup(processEnvironment.DATABASE_URI);

  return;
}

// tslint:disable-next-line:no-unnecessary-class - class serves as interface (with static method) for DB implementations
export class Database {
  static async setup(connectionUri: string): Promise<any> {
    throw new Error('Setup function not implemented for DB with the connection URI ' + connectionUri);
  }
}
