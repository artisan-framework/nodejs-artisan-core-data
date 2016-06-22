/// <reference path="../../../../../typings/artisan/artisan.d.ts" />
/// <reference path="../../../../../typings/artisan/artisan-core.d.ts" />

/// <reference path="../../../../../typings/lodash/lodash.d.ts" />
/// <reference path="../../../../../typings/tedious/tedious.d.ts" />

import Artisan from 'artisan';
import * as _ from 'lodash';
import { Connection, Request, ColumnValue, TYPES } from 'tedious';

import DataException from '../../Exceptions/DataException';
import ISqlCommand from '../ISqlCommand';
import ISqlTransaction from '../ISqlTransaction';
import ISqlDataReader from '../ISqlDataReader';
import SqlDataType from '../SqlDataType';
import SqlParameter from '../Impl/SqlParameter';
import BufferedDataReader from '../Impl/BufferedDataReader';
import SqlServerDataType from './SqlServerDataType';
import SqlServerTransaction from './SqlServerTransaction';

class SqlServerCommand implements ISqlCommand {
  private _connection: Connection;
  private _request: Request;
  private _outputParameters: {
    [parameterName: string]: any
  }

  private _onError: any;

  constructor(procedureName: string, connection: Connection) {
    this._connection = connection;
    this._request = new Request(procedureName, (err) => {
      if (err) {
        if (this._onError) {
          this._onError(err);
        }

        return;
      }
    });

    this._outputParameters = {};
  }

  public addInParameter(name: string, value: any, type: string, ...options: any[]): void {
    var sqlServerOptions = this.getParameterOptions(type, options);

    this._request.addParameter(name, this.getSqlServerDataType(type), value, sqlServerOptions);
  }

  public addInListParameter(name: string, value: any[], type: string, ...options: any[]) {
    var table = this.getListParameter(type, value, options);

    this._request.addParameter(name, TYPES.TVP, table);
  }
  
  public addInDictionaryParameter(name: string, value: Array<Artisan.Core.Collections.Generic.KeyValuePair<any, any>>, keyType: string, keyOption: any, valueType, valueOption) {
    var table = this.getDictionaryParameter(value, keyType, keyOption, valueType, valueOption);

    this._request.addParameter(name, TYPES.TVP, table);
  }

  public addOutParameter(name: string, type: string, ...options: any[]): void {
    var sqlServerOptions = this.getParameterOptions(type, options);

    this._request.addOutputParameter(name, this.getSqlServerDataType(type), null, sqlServerOptions);
  }

  public addInOutParameter(name: string, value: any, type: string, ...options: any[]): void {
    var sqlServerOptions = this.getParameterOptions(type, options);

    this._request.addOutputParameter(name, this.getSqlServerDataType(type), value, sqlServerOptions);
  }

  public beginTransaction(): Promise<ISqlTransaction> {
    return new Promise((resolve, reject) => {
      this._connection.beginTransaction((err) => {
        if (err) {
          reject(new DataException('An error occurred while attempting to start the transaction.', err));
          return;
        }

        resolve(new SqlServerTransaction(this._connection));
      })
    });
  }

  public executeNonQuery(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._outputParameters = {};

      this._request.on('returnValue', (parameterName: string, value: any) => {
        this._outputParameters[parameterName] = value;
      });

      this._request.on('doneProc', function() {
        resolve(true);
      });

      this._onError = function(err) {
        reject(new DataException('An error occurred while attempting to execute the command.', err));
      };

      this._connection.callProcedure(this._request);
    });
  }

  public executeReader(): Promise<ISqlDataReader> {
    return new Promise((resolve, reject) => {
      var results = [];
      this._outputParameters = {};

      var currentResult = null;
      var isResultSet = false;

      this._request.on('row', function(columns: ColumnValue[]) {
        if (currentResult == null) {
          currentResult = {
            Rows: []
          };
        }
        
        var columnValues = {};
        for (var columnName in columns) {
          columnValues[columnName] = columns[columnName].value;
        }
        
        currentResult.Rows.push(columnValues);
      });

      this._request.on('columnMetadata', function () {
        isResultSet = true;
      })
      
      this._request.on('doneInProc', function () {
        if (!isResultSet) {
          return;
        }
        
        results.push(currentResult || { Rows: [] });
        
        currentResult = null;
        isResultSet = false;
      });

      this._request.on('doneProc', function (rowCount: number, more: boolean, returnStatus: number, rows: any[]) {
        if (returnStatus == 0) {
          // Success!
          resolve(new BufferedDataReader(results));  
        }
      });
      
      this._request.on('returnValue', (parameterName: string, value: any) => {
        this._outputParameters[parameterName] = value;
      });

      this._onError = function(err) {
        reject(new DataException('An error occurred while attempting to execute the query.', err));
      }

      this._connection.callProcedure(this._request)
    });
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
  
  private getSqlServerDataType(type: string) {
    var sqlServerDataType = SqlServerDataType[type];
    
    if (!sqlServerDataType) {
      throw new DataException(`The specified type [${type}] is not supported.`);
    }
    
    return sqlServerDataType;
  }

  private getListParameter(type: string, values: any[], options: any[]) {
    var valueColumn = {
      name: 'Value',
      type: this.getSqlServerDataType(type)
    };
    
    _.extend(valueColumn, this.getParameterOptions(type, options));
    
    var result = {
      columns: [ valueColumn ],
      rows: _.map(values, function (value: any) {
        return [value];
      })
    };
    
    return result;
  }
  
  private getDictionaryParameter(values: Array<Artisan.Core.Collections.Generic.KeyValuePair<any, any>>, keyType: string, keyOption: any, valueType: string, valueOption: any) {
    var keyColumn = {
      name: 'Key',
      type: this.getSqlServerDataType(keyType)
    };
    
    var valueColumn = {
      name: 'Value',
      type: this.getSqlServerDataType(valueType)
    };
    
    _.extend(keyColumn, this.getParameterOptions(keyType, !!keyOption ? [keyOption] : []));
    _.extend(valueColumn, this.getParameterOptions(valueType, !!valueOption ? [valueOption] : []));
    
    var result = {
      columns: [ keyColumn, valueColumn ],
      rows: values.map(a => [a.Key, a.Value])
    };
    
    return result;
  }
}

export default SqlServerCommand;