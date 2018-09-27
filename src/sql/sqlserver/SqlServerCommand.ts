import KeyValuePair from 'artisan-core/lib/collections/KeyValuePair';
import ArgumentException from 'artisan-core/lib/exceptions/ArgumentException';
import { Connection, ISOLATION_LEVEL, Request, Table, Transaction, TYPES } from 'mssql';
import DataException from '../../exceptions/DataException';
import BufferedDataReader from '../impl/BufferedDataReader';
import ISqlCommand from '../ISqlCommand';
import ISqlDataReader from '../ISqlDataReader';
import ISqlTransaction from '../ISqlTransaction';
import SqlDataType from '../SqlDataType';
import SqlServerTransaction from './SqlServerTransaction';

class SqlServerCommand implements ISqlCommand {
  private _request: Request;
  private _connection: Connection;
  private _procedureName: string;

  private _onError: any;

  constructor(procedureName: string, connection: Connection) {
    this._connection = connection;
    this._request = new Request(connection);
    this._procedureName = procedureName;
  }

  public addInParameter(name: string, value: any, type: string, ...options: Array<any>): void {
    const sqlServerOptions = this.getParameterOptions(type, options);

    this._request.input(name, this.getSqlServerDataType(type, options), value);
  }

  public addInListParameter(name: string, values: Array<any>, type: string, ...options: Array<any>) {
    const tvp = new Table('');
    tvp.columns.add('Value', this.getSqlServerDataType(type, options), null);

    values.forEach((value) => {
       tvp.rows.add(value);
    });

    this._request.input(name, tvp);
  }

  public addInDictionaryParameter(name: string, values: Array<KeyValuePair<any, any>>, keyType: string, keyOption: any, valueType: string, valueOption: any) {
    const tvp = new Table('');
    tvp.columns.add('Key', this.getSqlServerDataType(keyType, [keyOption]), null);
    tvp.columns.add('Value', this.getSqlServerDataType(valueType, [valueOption]), null);

    values.forEach((kvp) => {
       tvp.rows.add(kvp.Key, kvp.Value);
    });

    this._request.input(name, tvp);
  }

  public addOutParameter(name: string, type: string, ...options: Array<any>): void {
    this._request.output(name, this.getSqlServerDataType(type, options), null);
  }

  public addInOutParameter(name: string, value: any, type: string, ...options: any[]): void {
    this._request.output(name, this.getSqlServerDataType(type, options), value);
  }

  public async beginTransaction(): Promise<ISqlTransaction> {
     try {
        const transaction = new Transaction(this._connection);
        await transaction.begin(ISOLATION_LEVEL.READ_COMMITTED);

        return new SqlServerTransaction(transaction);
     }
     catch (ex) {
        throw new DataException('An error has occurred while attempting to start the transaction.', ex);
     }
  }

  public async executeNonQuery(): Promise<void> {
    await this._request.execute(this._procedureName);
  }

  public async executeReader(): Promise<ISqlDataReader> {
    const mssqlResultSets: Array<any> = await this._request.execute(this._procedureName);
    const resultSets = mssqlResultSets.map((mssqlResultSet) => {
      return {
         Rows: mssqlResultSet
      };
    });

    return new BufferedDataReader(resultSets);
  }

  public getOutputParameter(name: string) {
    if (this._request.parameters[name] === undefined) {
      throw new DataException(`Unable to retrieve output parameter [${name}].`);
    }

    return this._request.parameters[name].value;
  }

  public dispose(): void {
    this._connection.close();
  }

  private getParameterOptions(type: string, options: any[]) {
    switch (type) {
      case SqlDataType.NVarChar:
      case SqlDataType.VarChar:
        return {
          length: options[0]
        };
    }

    return null;
  }

  private getSqlServerDataType(type: string, options: any[]) {
    switch (type) {
       case SqlDataType.Byte:
         return TYPES.TinyInt;
       case SqlDataType.Guid:
         return TYPES.UniqueIdentifier;
       case SqlDataType.Int16:
         return TYPES.SmallInt;
       case SqlDataType.Int32:
         return TYPES.Int;
       case SqlDataType.NVarChar:
         if (typeof (options[0]) !== 'number') {
            throw new ArgumentException('options', 'The length of the NVarChar parameter must be specified.');
         }
         return TYPES.NVarChar(options[0]);
       case SqlDataType.VarChar:
         if (typeof (options[0]) !== 'number') {
            throw new ArgumentException('options', 'The length of the NVarChar parameter must be specified.');
         }
         return TYPES.VarChar(options[0]);
    }

    throw new DataException(`The specified type [${type}] is not supported.`);
  }
}

export default SqlServerCommand;
