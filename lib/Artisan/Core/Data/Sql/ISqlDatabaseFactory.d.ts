import ISqlDatabase from './ISqlDatabase';

/**
 * The factory used to create ISqlDatabase instances, based on the connection options
 * that have been configured for this application.
 */
interface ISqlDatabaseFactory {
    /**
     * Gets a database instance, based on the specified configuration.  If no custom configuration exists
     * for the specified name, then the default configuration will be used.  The result can be used to
     * establish a connection to the associated database.
     * @param  {string} databaseName - The name of the database, used to load the proper configuration.
     * @returns ISqlDatabase - The configured database instance.
     */
    getDatabase(databaseName: string): ISqlDatabase;
}

export default ISqlDatabaseFactory;