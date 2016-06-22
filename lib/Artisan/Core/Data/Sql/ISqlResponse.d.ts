/**
 * Represents the response returned by a particular statement.
 */
interface ISqlResponse {
    /**
     * Gets the specified OUTPUT parameter value from the associated statement.
     * @param  {string} name - The name of the value being retrieved.
     * @returns any - The value of the parameter.
     */
    getValue(name: string): any;
}