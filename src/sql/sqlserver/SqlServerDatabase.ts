import { ConnectionPool, Request } from 'mssql';

import DataException from '../../exceptions/DataException';
import ISqlCommand from '../ISqlCommand';
import ISqlConnection from '../ISqlConnection';
import ISqlDatabase from '../ISqlDatabase';
import ISqlDataReader from '../ISqlDataReader';
import SqlServerCommand from './SqlServerCommand';

class SqlServerDatabase implements ISqlDatabase {
  constructor(connection: ISqlConnection) {
     this.connection = connection;
  }

  public connection: ISqlConnection;

  public async createCommand(procedureName: string): Promise<ISqlCommand> {
    try {
      const connection = new ConnectionPool(this.connection.ConnectionOptions);
      await connection.connect();

      return new SqlServerCommand(procedureName, connection);
    }
    catch (err) {
      throw new DataException('An error occurred while attempting to create a new connection.', err);
    }
  }

  public executeReader(command: ISqlCommand): Promise<ISqlDataReader> {
    return command.executeReader();
  }

  public executeNonQuery(command: ISqlCommand): Promise<void> {
    return command.executeNonQuery();
  }

  public translateWildcards(value: string): string {
    return value.replace('*', '%');
  }
}

export default SqlServerDatabase;
