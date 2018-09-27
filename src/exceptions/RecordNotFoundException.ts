import DataException from './DataException';

/**
 * The exception that is thrown when an attempt is made to retrieve a record that does not exist.
 */
class RecordNotFoundException extends DataException {
    /**
     * Creates a new instance.
     * @param  {string} id - The unique id of the entity being retrieved.
     * @param  {any} innerException - The exception that caused the current exception.
     */
    constructor(id: string, innerException: any = null) {
        super(`The specified entity [${id}] does not exist.`, innerException);

        this.name = 'RecordNotFoundException';
    }
}

export default RecordNotFoundException;
