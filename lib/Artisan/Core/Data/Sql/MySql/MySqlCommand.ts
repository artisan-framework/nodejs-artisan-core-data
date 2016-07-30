///<reference path="../../../../../typings/artisan/artisan.d.ts"/>
///<reference path="../../../../../typings/artisan/artisan-core.d.ts"/>
///<reference path="../../../../../typings/mysql/mysql.d.ts"/>
///<reference path="../../../../../typings/lodash/lodash.d.ts"/>

import * as _ from 'lodash';
import Artisan from 'artisan-framework';
import Verify = Artisan.Core.Exceptions.Verify;
import { IConnection } from 'mysql';

import ISqlCommand from '../ISqlCommand';
import ISqlParameter from '../ISqlParameter';
import ISqlDataReader from '../ISqlDataReader';
import ISqlTransaction from '../ISqlTransaction';
import DataException from '../../Exceptions/DataException';
import BufferedDataReader from '../Impl/BufferedDataReader';
import MySqlTransaction from './MySqlTransaction';
import SqlParameter from '../Impl/SqlParameter';

/**
 * MySqlCommand is an implementation of ISqlCommand that can be used to execute a statement
 * against a MySQL database.
 */
class MySqlCommand implements ISqlCommand {
    private _commandText: string;
    private _commandType: string;
    private _connection: IConnection;
    private _parameters: ISqlParameter[];
   
    /**
     * Creates a new instance.
     * @param  {string} commandText - The name of the stored procedure to execute.
     * @param  {string} commandType - The command type: StoredProcedure.
     * @param  {any} connection - The connection used to execute the statement.
     */
    constructor(commandText: string, commandType: string, connection: any) {
        Verify.that(commandText, 'commandText').isNotNullOrEmpty();
        Verify.that(commandType, 'commandType').isNotNullOrEmpty();
        Verify.that(connection, 'connection').isNotNull();

        this._commandText = commandText;
        this._commandType = commandType;
        this._connection = connection;

        this._parameters = [];
    }

    beginTransaction(): Promise<ISqlTransaction> {
        return new Promise((resolve, reject) => {
            this._connection.beginTransaction((err) => {
                if (err) {
                    reject(new DataException('An error occurred while attempting to begin a transaction.', err));
                    return;
                }

                resolve(new MySqlTransaction(this._connection));
            })
        });
    }

    public addInParameter(name: string, value: any, type: string, ...options: any[]): void {
        this._parameters.push(new SqlParameter(name, type, value));
    }

    public addInListParameter(name: string, value: any[], type: string, ...options: any[]): void {
        throw new Artisan.Core.Exceptions.NotSupportedException();
    }
    
    public addInDictionaryParameter(name: string, value: Array<Artisan.Core.Collections.Generic.KeyValuePair<any, any>>, keyType: string, keyOption: any, valueType, valueOption) {
        throw new Artisan.Core.Exceptions.NotSupportedException();
    }

    public addOutParameter(name: string, type: string, ...options: any[]): void {
        throw new Artisan.Core.Exceptions.NotSupportedException();
    }

    public addInOutParameter(name: string, value: any, type: string, ...options: any[]): void {
        throw new Artisan.Core.Exceptions.NotSupportedException();
    }

    public executeReader(): Promise<ISqlDataReader> {
        var params = _.map(this._parameters, function() { return '?'; }).join(', ');
        var values = _.pluck(this._parameters, 'Value');
        var query = 'call ' + this._commandText + '(' + params + ')';

        return new Promise<ISqlDataReader>((resolve, reject) => {
            this._connection.query(query, values, (err, response) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(new BufferedDataReader(response));
            });
        });
    }

    public executeNonQuery(): Promise<boolean> {
        var params = _.map(this._parameters, function() { return '?'; }).join(', ');
        var values = _.pluck(this._parameters, 'Value');
        var query = 'call ' + this._commandText + '(' + params + ')';

        return new Promise<boolean>(function(resolve, reject) {
            this._connection.query(query, values, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(true);
            });
        });
    }

    public getOutputParameter(name: string): any {
        throw new Artisan.Core.Exceptions.NotSupportedException('Output parameters are not supported by MySql.');
    }

    public dispose(): void {
        this._connection.end();
    }
}

export default MySqlCommand;