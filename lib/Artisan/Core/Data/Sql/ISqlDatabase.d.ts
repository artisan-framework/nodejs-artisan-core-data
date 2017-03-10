import ISqlConnection from './ISqlConnection';
import ISqlCommand from './ISqlCommand';
import ISqlDataReader from './ISqlDataReader';

/**
 * Represents an established connection to a SQL database.
 */
interface ISqlDatabase {
    /**
     * Gets the connection.
     */
    connection: ISqlConnection;
    
    /**
     * Async - Creates a new command, that can be used to execute a statement against the database.
     * @param  {string} procedureName - The name of the stored procedure being executed.
     * @returns Promise - The newly created commany.
     */
    createCommand(procedureName: string): Promise<ISqlCommand>;
    
    /**
     * Executes the specified statement against the database, expecting one or more result setes to be returned.
     * @param  {ISqlCommand} command - The command to be executed.
     * @returns Promise - The result sets returned by the statement.
     */
    executeReader(command: ISqlCommand): Promise<ISqlDataReader>;
    
    /**
     * Executes the specified statement against the database, expecting no result sets to be returned.
     * @param  {ISqlCommand} command - The command to be executed.
     * @returns Promise - The result, indicating whether or not the statement was successful.
     */
    executeNonQuery(command: ISqlCommand): Promise<void>;
    
    /**
     * Translates the '*' wildcard characters in the specified value, based on the underlying provider.
     * @param  {string} value - The value to be translated.
     * @returns string - The resulting value.
     */
    translateWildcards(value: string): string;
}

export default ISqlDatabase;