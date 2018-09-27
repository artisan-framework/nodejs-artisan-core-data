import DataException from '../../exceptions/DataException';

/**
 * The exception that is thrown when an error occurs while interacting with a SQL database.
 */
class SqlException extends DataException {
    /**
     * Creates a new instance.
     * @param  {string} message? - A message that describes the error.
     * @param  {any} innerException - The exception that caused the current exception.
     */
    constructor(message: string, innerException: any = null) {
        super(message, innerException);

        this.name = 'SqlException';
    }
}

export default SqlException;
