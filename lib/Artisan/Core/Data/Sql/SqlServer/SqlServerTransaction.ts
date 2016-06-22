///<reference path="../../../../../typings/lodash/lodash.d.ts"/>
///<reference path="../../../../../typings/tedious/tedious.d.ts"/>

import { Connection } from 'tedious';
import DataException from '../../Exceptions/DataException';
import ISqlTransaction from '../ISqlTransaction';

/**
 * SqlServerTransaction is an implementation of ISqlTransaction that has been
 * established against a SQL Server database.
 */
class SqlServerTransaction implements ISqlTransaction {
   private _connection: Connection;
   
   /**
    * Creates a new instance.
    */
   constructor(connection: Connection) {
      this._connection = connection;
   }

   commit(): Promise<boolean> {
      return new Promise((resolve, reject) => {
         this._connection.commitTransaction(function (err) {
            if (err) {
               reject(new DataException('An error occurred while attempting to commit the transaction.', err));
               return;
            }

            resolve(true);
         });
      });
   }

   rollback(): Promise<boolean> {
      return new Promise((resolve, reject) => {
         this._connection.rollbackTransaction(function () {
            resolve(true);
         });
      });
   }
}

export default SqlServerTransaction;