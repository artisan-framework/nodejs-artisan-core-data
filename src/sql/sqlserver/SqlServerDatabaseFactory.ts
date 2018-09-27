import ISqlDatabaseFactory from '../ISqlDatabaseFactory';
import ISqlDatabaseFactoryConfiguration from '../ISqlDatabaseFactoryConfiguration';
import SqlServerDatabase from './SqlServerDatabase';

/**
 * SqlServerDatabaseFactory is an implementation of ISqlDatabaseFactory that can be used to create
 * instances of a SQL Server database.
 */
class SqlServerDatabaseFactory implements ISqlDatabaseFactory {
    public static $inject = ['$sqlDatabaseFactoryConfiguration'];

    /**
     * Creates a new instance.
     */
    constructor(private $sqlDatabaseFactoryConfiguration: ISqlDatabaseFactoryConfiguration) {
        // Intentionally left blank.
    }

    public getDatabase(databaseName: string) {
        let configuration = this.$sqlDatabaseFactoryConfiguration[databaseName];

        if (!configuration) {
            configuration = this.$sqlDatabaseFactoryConfiguration['_default'];
        }

        return new SqlServerDatabase(configuration);
    }
}

export default SqlServerDatabaseFactory;
