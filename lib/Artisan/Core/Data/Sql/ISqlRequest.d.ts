/// <reference path="../../../../typings/artisan/artisan.d.ts" />
/// <reference path="../../../../typings/artisan/artisan-core.d.ts" />

import Artisan from 'artisan-framework';
import ISqlParameter from './ISqlParameter';

/**
 * Represents a request being made to the database.
 */
interface ISqlRequest {
    /**
     * The list of parameters attached to the request.
     */
    parameters: ISqlParameter[];
    
    /**
     * Adds the specified parameter to the request.
     * @param  {string} name - The name of the parameter.
     * @param  {any} value - The value of the parameter.
     * @param  {string} type - The parameter type.
     * @param  {any[]} ...options - Additional options, based on the parameter type.
     */
    addInParameter(name: string, value: any, type: string, ...options: any[]): void;
    
    /**
     * Adds the specified multi-valued parameter to the request.
     * @param  {string} name - The name of the parameter.
     * @param  {any} value - The value of the parameter.
     * @param  {string} type - The parameter type.
     * @param  {any[]} ...options - Additional options, based on the parameter type.
     */
    addInListParameter(name: string, value: any[], type: string, ...options: any[]): void;
    
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
}

export default ISqlRequest;