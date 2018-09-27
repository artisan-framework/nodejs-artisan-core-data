/**
 * Represents an established transaction to a particular SQL database.
 */
interface ISqlTransaction {
    /**
     * Commits the transaction.
     */
    commit(): Promise<void>;

    /**
     * Rolls back the transaction, usually because an error occurred while
     * attempting to submit or translate the request.
     */
    rollback(): Promise<void>;
}

export default ISqlTransaction;
