import ISqlDatabaseFactory from '../ISqlDatabaseFactory';
import ISqlDatabaseFactoryConfiguration from '../ISqlDatabaseFactoryConfiguration';
import MySqlDatabase from './MySqlDatabase';

/**
 * MySqlDatabaseFactory is an implementation of ISqlDatabaseFactory that can be used to create
 * instances of a MySQL database.
 */
class MySqlDatabaseFactory implements ISqlDatabaseFactory {
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

        return new MySqlDatabase(configuration);
    }
}

export default MySqlDatabaseFactory;
