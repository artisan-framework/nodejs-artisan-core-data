/**
 * Represents an established transaction to a particular SQL database.
 */
interface ISqlTransaction {
    /**
     * Commits the transaction.
     * @returns Promise - The result, indicating success or failure. 
     */
    commit(): Promise<boolean>;
    
    /**
     * Rolls back the transaction, usually because an error occurred while 
     * attempting to submit or translate the request.
     * @returns Promise - The result, indicating success or failure.
     */
    rollback(): Promise<boolean>;
}

export default ISqlTransaction;