/// <reference path="../../../../../typings/artisan/artisan.d.ts"/>
/// <reference path="../../../../../typings/artisan/artisan-core.d.ts"/>
/// <reference path="../../../../../typings/mysql/mysql.d.ts"/>

import * as mysql from 'mysql';

import Artisan from 'artisan-framework';
import Verify = Artisan.Core.Exceptions.Verify;

import ISqlCommand from '../ISqlCommand';
import ISqlConnection from '../ISqlConnection';
import ISqlDatabase from '../ISqlDatabase';
import ISqlDataReader from '../ISqlDataReader';
import DataException from '../../Exceptions/DataException';
import MySqlCommand from './MySqlCommand';

/**
 * MySqlDatabase is an implementation of ISqlDatabase that can be used to connect to a MySQL database.
 */
class MySqlDatabase implements ISqlDatabase {
    /**
     * Creates a new instance.
     * @param  {ISqlConnection} connection - The connection information.
     */
    constructor(connection: ISqlConnection) {
        Verify.that(connection, 'connection').isNotNull();

        this.connection = connection;
    }

    public connection: ISqlConnection;

    public createCommand(procedureName: string): Promise<ISqlCommand> {
        return new Promise((resolve, reject) => {
            try {
                var connection = mysql.createConnection(this.connection.ConnectionOptions);

                resolve(new MySqlCommand(procedureName, 'StoredProcedure', connection));
            }
            catch (err) {
                reject(new DataException('An error occurred while attempting to create a new connection.', err));
            }
        });
    }

    public addInParameter(command: ISqlCommand, name: string, type: string, value: any) {
        command.addInParameter(name, type, value);
    }

    public addInOutParameter(command: ISqlCommand, name: string, type: string, value: any) {
        throw new DataException('OUT parameters are not supported.');
    }

    public addOutParameter(command: ISqlCommand, name: string, type: string) {
        throw new DataException('OUT parameters are not supported.');
    }

    public executeReader(command: ISqlCommand): Promise<ISqlDataReader> {
        return command.executeReader();
    }

    public executeNonQuery(command: ISqlCommand): Promise<boolean> {
        return command.executeNonQuery();
    }

    public translateWildcards(value: string) {
        if (value == null)
            return null;

        return value.replace(/\*/g, '%');
    }
}

export default MySqlDatabase;