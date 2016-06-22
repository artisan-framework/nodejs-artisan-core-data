import { Connection, Request } from 'tedious';

import DataException from '../../Exceptions/DataException';
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

  createCommand(procedureName: string): Promise<ISqlCommand> {
    return new Promise((resolve, reject) => {
      try {
        var connection = new Connection(this.connection.ConnectionOptions);

        connection.on('connect', function (err) {
          if (err) {
            reject(new DataException('An error occurred while attempting to create a new connection.', err));
          }

          resolve(new SqlServerCommand(procedureName, connection));
        });
      }
      catch (err) {
        throw new DataException('An error occurred while attempting to create a new connection.', err);
      }
    });
  }

  executeReader(command: ISqlCommand): Promise<ISqlDataReader> {
    return command.executeReader();
  }

  executeNonQuery(command: ISqlCommand): Promise<boolean> {
    return command.executeNonQuery();
  }

  translateWildcards(value: string): string {
    return value.replace('*', '%');
  }
}

export default SqlServerDatabase;