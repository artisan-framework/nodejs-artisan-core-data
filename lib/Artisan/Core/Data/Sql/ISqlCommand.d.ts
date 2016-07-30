/// <reference path="../../../../typings/artisan/artisan.d.ts" />
/// <reference path="../../../../typings/artisan/artisan-core.d.ts" />

import Artisan from 'artisan-framework';
import IDisposable = Artisan.Core.IDisposable;
import ISqlDataReader from './ISqlDataReader';
import ISqlTransaction from './ISqlTransaction';

/**
 * Represents a statement to be executed against a SQL database.
 */
interface ISqlCommand extends IDisposable {
    /**
     * Adds the specified parameter to the request.
     * @param  {string} name - The name of the parameter.
     * @param  {any} value - The value of the paramter.
     * @param  {string} type - The parameter type.
     * @param  {any[]} ...options - Additional options, based on the parameter type.
     */
    addInParameter(name: string, value: any, type: string, ...options: any[]): void;
    
    /**
     * Adds the specified table-valued parameter to the request.
     * @param  {string} name - The name of the parameter.
     * @param  {any} value - The value of the parameter.
     * @param  {string} type - The parameter type.
     * @param  {any[]} ...options - Additional options, based on the parameter type.
     */
    addInListParameter(name: string, value: any, type: string, ...options: any[]);
    
    /**
     * Adds the specified multi-valued parameter to the request.
     * @param  {string} name - The name of the parameter.
     * @param  {any} value - The value of the parameter.
     * @param  {string} keyType - The parameter type of the keys.
     * @param  {any} keyOption - Additional options, based on the key parameter type.
     * @param  {string} valueType - The parameter type of the values.
     * @param  {any} valueOption - Additional options, based on the value parameter type.
     */
    addInDictionaryParameter(name: string, value: Artisan.Core.Collections.Generic.KeyValuePair<any, any>[], keyType: string, keyOption: any, valueType: string, valueOption: any): void;

    /**
     * Adds the specified OUTPUT parameter to the request.
     * @param  {string} name - The name of the parameter.
     * @param  {string} type - The parameter type.
     * @param  {any[]} ...options - Additional options, based on the parameter type.
     */
    addOutParameter(name: string, type: string, ...options: any[]): void;
    
    /**
     * Adds the specified OUTPUT parameter to the request.
     * @param  {string} name - The name of the parameter.
     * @param  {any} value - The value of the parameter.
     * @param  {string} type - The parameter type.
     * @param  {any[]} ...options - Additional options, based on the parameter type.
     */
    addInOutParameter(name: string, value: any, type: string, ...options: any[]): void;
    
    /**
     * Async - Begins a transaction on the associated connection.
     * @returns Promise - The newly created transaction.
     */
    beginTransaction(): Promise<ISqlTransaction>;
    
    /**
     * Async - Executes the statement, expecting no result sets to be returned.
     * @returns Promise - The statement result.
     */
    executeNonQuery(): Promise<boolean>;
    
    /**
     * Async - Executes the statement, expecting one or more results sets to be returned.
     * @returns Promise - The reader that contains the results returned by the statement.
     */
    executeReader(): Promise<ISqlDataReader>;
    
    /**
     * Gets the value of the specified OUTPUT parameter, after the statement has been executed.
     * @param  {string} name - The name of the OUTPUT parameter being retrieved.
     * @returns any - The value of the parameter.
     */
    getOutputParameter(name: string): any;
}

export default ISqlCommand;