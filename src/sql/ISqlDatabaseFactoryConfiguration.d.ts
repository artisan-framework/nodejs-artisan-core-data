/**
 * Contains configuration options used to configure the ISqlDatabaseFactory.
 */
interface ISqlDatabaseFactoryConfiguration {
    /**
     * Gets the connection options, with the specified name.
     */
    [databaseName: string]: any;
}

export default ISqlDatabaseFactoryConfiguration;