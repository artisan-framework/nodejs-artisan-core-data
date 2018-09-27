import KeyValuePair from 'artisan-core/lib/collections/KeyValuePair';
import NotSupportedException from 'artisan-core/lib/exceptions/NotSupportedException';
import Verify from 'artisan-core/lib/exceptions/Verify';
import { IConnection } from 'mysql';
import DataException from '../../exceptions/DataException';
import BufferedDataReader from '../impl/BufferedDataReader';
import SqlParameter from '../impl/SqlParameter';
import ISqlCommand from '../ISqlCommand';
import ISqlDataReader from '../ISqlDataReader';
import ISqlParameter from '../ISqlParameter';
import ISqlTransaction from '../ISqlTransaction';
import MySqlTransaction from './MySqlTransaction';

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

    public beginTransaction(): Promise<ISqlTransaction> {
        return new Promise((resolve, reject) => {
            this._connection.beginTransaction((err) => {
                if (err) {
                    reject(new DataException('An error occurred while attempting to begin a transaction.', err));
                    return;
                }

                resolve(new MySqlTransaction(this._connection));
            });
        });
    }

    public addInParameter(name: string, value: any, type: string, ...options: any[]): void {
        this._parameters.push(new SqlParameter(name, type, value));
    }

    public addInListParameter(name: string, value: any[], type: string, ...options: any[]): void {
        throw new NotSupportedException('This method is not supported by MySQL');
    }

    public addInDictionaryParameter(name: string, value: Array<KeyValuePair<any, any>>, keyType: string, keyOption: any, valueType: string, valueOption: any): void {
      throw new NotSupportedException('This method is not supported by MySQL');
   }

    public addOutParameter(name: string, type: string, ...options: any[]): void {
      throw new NotSupportedException('This method is not supported by MySQL');
   }

    public addInOutParameter(name: string, value: any, type: string, ...options: any[]): void {
      throw new NotSupportedException('This method is not supported by MySQL');
   }

    public executeReader(): Promise<ISqlDataReader> {
        const params = this._parameters.map(a => '?').join(', ');
        const values = this._parameters.map(a => a.Value);
        const query = `call ${ this._commandText }(${ params })`;

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

    public executeNonQuery(): Promise<void> {
        const params = this._parameters.map(() => '?').join(', ');
        const values = this._parameters.map(a => a.Value);
        const query = `call ${ this._commandText }(${ params })`;

        return new Promise((resolve, reject) => {
            this._connection.query(query, values, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(true);
            });
        }).then(() => {});
    }

    public getOutputParameter(name: string): any {
        throw new NotSupportedException('Output parameters are not supported by MySql.');
    }

    public dispose(): void {
        this._connection.end();
    }
}

export default MySqlCommand;
