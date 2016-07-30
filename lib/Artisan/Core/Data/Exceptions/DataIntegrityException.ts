///<reference path="../../../../typings/artisan/artisan.d.ts"/>
///<reference path="../../../../typings/artisan/artisan-core.d.ts"/>

import Artisan from 'artisan-framework';
import DataException from './DataException';

/**
 * The exception that is thrown when an attempt to remove or update a record would
 * result in an invalid reference, usually in another part of the system.
 */
class DataIntegrityException extends DataException {
    /**
     * Creates a new instance.
     * @param  {string} message - A message that describes the error.
     * @param  {any} innerException - The exception that caused the current exception.
     */
    constructor(message: string, innerException: any = null) {
        super(message, innerException);
        
        this.name = 'DataIntegrityException';
    }
}

export default DataIntegrityException;