///<reference path="../../../../typings/artisan/artisan.d.ts"/>
///<reference path="../../../../typings/artisan/artisan-core.d.ts"/>

import Artisan from 'artisan';
import BaseException = Artisan.Core.Exceptions.BaseException;

/**
 * The exception that is thrown by the data access layer.
 */
class DataException extends BaseException {
    /**
     * Creates a new instance.
     * @param  {string} message - A message that describes the error.
     * @param  {any} innerException - The exception that caused the current exception.
     */
    constructor(message: string, innerException: any = null) {
        super('DataException', message, innerException);
    }
}

export default DataException;