///<reference path="../../../../typings/artisan/artisan.d.ts"/>
///<reference path="../../../../typings/artisan/artisan-core.d.ts"/>

import Artisan from 'artisan-framework';
import DataException from './DataException';

/**
 * The exception that is thrown when an attempt is made to create a record that
 * would violate a unique key constraint.
 */
class DuplicateRecordException extends DataException {
    /**
     * Creates a new instance.
     * @param  {string} message - A message that describes the error.
     * @param  {any} innerException - The exception that caused the current exception.
     */
    constructor(message: string, innerException: any = null) {
        super(message, innerException);
        
        this.name = 'DuplicateRecordException';
    }
}

export default DuplicateRecordException;