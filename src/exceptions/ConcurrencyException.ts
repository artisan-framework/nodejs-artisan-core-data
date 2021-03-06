import DataException from './DataException';

/**
 * The exception that is thrown when an attempt is made to update a stale resource.
 */
class ConcurrencyException extends DataException {
    /**
     * Creates a new instance.
     * @param  {string} message - A message that describes the error.
     * @param  {any} innerException - The exception that caused the current exception.
     */
    constructor(message: string, innerException: any = null) {
        super(message, innerException);

        this.name = 'ConcurrencyException';
    }
}

export default ConcurrencyException;
