import { Transaction } from 'mssql';
import DataException from '../../exceptions/DataException';
import ISqlTransaction from '../ISqlTransaction';

/**
 * SqlServerTransaction is an implementation of ISqlTransaction that has been
 * established against a SQL Server database.
 */
class SqlServerTransaction implements ISqlTransaction {
   private _transaction: Transaction;

   /**
    * Creates a new instance.
    */
   constructor(transaction: Transaction) {
      this._transaction = transaction;
   }

   public async commit(): Promise<void> {
      try {
         await this._transaction.commit();
      }
      catch (ex) {
         throw new DataException('An error occurred while attempting to commit the transaction.', ex);
      }
   }

   public async rollback(): Promise<void> {
      await this._transaction.rollback();
   }
}

export default SqlServerTransaction;
