import DataException from '../../Exceptions/DataException';
import ISqlDatabaseFactory from '../ISqlDatabaseFactory';
import ISqlDatabaseFactoryConfiguration from '../ISqlDatabaseFactoryConfiguration';
import MySqlDatabase from './MySqlDatabase';

/**
 * MySqlDatabaseFactory is an implementation of ISqlDatabaseFactory that can be used to create 
 * instances of a MySQL database. 
 */
class MySqlDatabaseFactory implements ISqlDatabaseFactory {
    static $inject = ['$sqlDatabaseFactoryConfiguration'];
   
    /**
     * Creates a new instance.
     */
    constructor(private $sqlDatabaseFactoryConfiguration: ISqlDatabaseFactoryConfiguration) {
        // Intentionally left blank.
    }

    getDatabase(databaseName: string) {
        var configuration = this.$sqlDatabaseFactoryConfiguration[databaseName];

        if (!configuration) {
            configuration = this.$sqlDatabaseFactoryConfiguration['_default'];
        }

        return new MySqlDatabase(configuration);
    }
}

export default MySqlDatabaseFactory;