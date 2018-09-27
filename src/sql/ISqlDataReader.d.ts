/**
 * Contains a set of results returned by a particular statement.
 */
interface ISqlDataReader {
    /**
     * Updates the reader to load the next result set.
     * @param  {string} name - The name of the result set.
     */
    nextResult(name: string): void;

    /**
     * Updates the reader to load the next row in the current result set.
     * @returns boolean - True if there are more rows; false, otherwise.
     */
    read(): boolean;

    /**
     * Gets the specified value from the current row.
     * @param  {string} name - The name of the field to be returned.
     * @returns any - The resulting value, returned by the statement.
     */
    getValue(name: string): any;
}

export default ISqlDataReader;
