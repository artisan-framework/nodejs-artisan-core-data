/**
 * Represents the configuration that is used to connect to a SQL database.
 */
interface ISqlConnection {
    /**
     * The name of the database.
     */
    Name: string;

    /**
     * Indicates the provider type, such as MySQL or SQL Server.
     */
    ProviderType: string;

    /**
     * Contains additional configuration options used to establish the connection.
     */
    ConnectionOptions: any;
}

export default ISqlConnection;
