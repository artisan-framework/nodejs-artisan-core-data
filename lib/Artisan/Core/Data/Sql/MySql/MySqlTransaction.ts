import DataException from '../../Exceptions/DataException';
import ISqlTransaction from '../ISqlTransaction';

class MySqlTransaction implements ISqlTransaction {
   private _connection: any;

   constructor(connection: any) {
      this._connection = connection;
   }

   commit(): Promise<boolean> {
      return new Promise((resolve, reject) => {
         this._connection.commit(function (err) {
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
         this._connection.rollback(function () {
            resolve(true);
         });
      });
   }
}

export default MySqlTransaction;