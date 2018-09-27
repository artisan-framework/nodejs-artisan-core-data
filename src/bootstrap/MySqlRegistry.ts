import IInjector from 'artisan-core/lib/bootstrap/IInjector';
import IRegistry from 'artisan-core/lib/bootstrap/IRegistry';
import MySqlDatabaseFactory from '../sql/mysql/MySqlDatabaseFactory';

/**
 * Registers the dependencies required for MySQL integration.
 */
class MySqlRegistry implements IRegistry {
   public register(injector: IInjector): void {
      injector.register('$sqlDatabaseFactory', MySqlDatabaseFactory);
   }
}

export default MySqlRegistry;
