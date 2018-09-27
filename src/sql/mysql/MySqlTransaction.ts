import DataException from '../../exceptions/DataException';
import ISqlTransaction from '../ISqlTransaction';

class MySqlTransaction implements ISqlTransaction {
   private _connection: any;

   constructor(connection: any) {
      this._connection = connection;
   }

   public commit(): Promise<void> {
      return new Promise((resolve, reject) => {
         this._connection.commit((err: any) => {
            if (err) {
               reject(new DataException('An error occurred while attempting to commit the transaction.', err));
               return;
            }

            resolve(true);
         });
      }).then(() => {});
   }

   public rollback(): Promise<void> {
      return new Promise((resolve, reject) => {
         this._connection.rollback(function () {
            resolve(true);
         });
      }).then(() => {});
   }
}

export default MySqlTransaction;
