import ISqlDataReader from '../ISqlDataReader';

interface ResultRow {
   [name: string]: any;
}

interface ResultSet {
   Rows: ResultRow[];
}

/**
 * BufferedDataReader is an implementation of ISqlDataReader that iterates over a data set that has already
 * been fully loaded from the underlying database provider.
 */
class BufferedDataReader implements ISqlDataReader {
   private _results: ResultSet[];
   private _idxResult: number;
   private _idxRow: number;

   /**
    * Creates a new instance.
    * @param  {ResultSet[]} results - The result used to populate the reader.
    */
   constructor(results: ResultSet[]) {
      this._results = results;

      this._idxResult = 0;
      this._idxRow = -1;
   }

   public nextResult(name: string): void {
      // NOTE: We do not perform a validation check on this result set,
      //       because some database drivers do not provide an "end of result"
      //       indicator if no results are returned on the final result set.
      //
      //       The intended behavior is that the reader will simply return zero
      //       rows for any result sets that have not yet been processed.

      this._idxResult += 1;
      this._idxRow = -1;
   }

   public read(): boolean {
      const currentResult = this._getCurrentResult();

      if (currentResult == undefined) {
         return false;
      }

      this._idxRow += 1;
      if (this._idxRow >= currentResult.Rows.length) {
         // Revert back to the previous row.
         this._idxRow -= 1;

         return false;
      }

      return true;
   }

   public getValue(name: string): any {
      const row = this._getCurrentRow();

      if (!row) {
         return undefined;
      }

      return row[name];
   }

   private _getCurrentResult() {
      const currentResult = this._results[this._idxResult];

      return currentResult || undefined;
   }

   private _getCurrentRow() {
      const currentResult = this._getCurrentResult();

      if (currentResult == undefined) {
         return undefined;
      }

      const currentRow = currentResult.Rows[this._idxRow];

      return currentRow || undefined;
   }
}

export default BufferedDataReader;
