/// <reference path="../../../../../typings/artisan/artisan.d.ts" />
/// <reference path="../../../../../typings/artisan/artisan-core.d.ts" />

import Artisan from 'artisan-framework';
import ArgumentException = Artisan.Core.Exceptions.ArgumentException;
import * as _ from 'lodash';
import { Connection, Request, Transaction, ISOLATION_LEVEL, TYPES, Table } from 'mssql';

import DataException from '../../Exceptions/DataException';
import ISqlCommand from '../ISqlCommand';
import ISqlTransaction from '../ISqlTransaction';
import ISqlDataReader from '../ISqlDataReader';
import SqlDataType from '../SqlDataType';
import SqlParameter from '../Impl/SqlParameter';
import BufferedDataReader from '../Impl/BufferedDataReader';
import SqlServerTransaction from './SqlServerTransaction';

class SqlServerCommand implements ISqlCommand {
  private _request: Request;
  private _connection: Connection;
  private _procedureName: string;

  private _outputParameters: {
    [parameterName: string]: any
  }

  private _onError: any;

  constructor(procedureName: string, connection: Connection) {
    this._connection = connection;
    this._request = new Request(connection);
    this._procedureName = procedureName;

    this._outputParameters = {};
  }

  public addInParameter(name: string, value: any, type: string, ...options: Array<any>): void {
    var sqlServerOptions = this.getParameterOptions(type, options);

    this._request.input(name, this.getSqlServerDataType(type, options), value);
  }

  public addInListParameter(name: string, values: Array<any>, type: string, ...options: Array<any>) {
    const tvp = new Table(null);
    tvp.columns.add('Value', this.getSqlServerDataType(type, options), null);
    
    values.forEach((value) => {
       tvp.rows.add(value);
    });

    this._request.input(name, tvp);
  }
  
  public addInDictionaryParameter(name: string, values: Array<Artisan.Core.Collections.Generic.KeyValuePair<any, any>>, keyType: string, keyOption: any, valueType, valueOption) {
    const tvp = new Table(null);
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
      }
    });

    return new BufferedDataReader(resultSets);
  }

  public getOutputParameter(name: string) {
    if (this._outputParameters[name] === undefined) {
      throw new DataException(`Unable to retrieve output parameter [${name}].`)
    }

    return this._outputParameters[name];
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
        }
    }

    return null;
  }
  
  private getSqlServerDataType(type: string, options: any[]) {
    switch(type) {
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