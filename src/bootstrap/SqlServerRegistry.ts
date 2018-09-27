import IInjector from 'artisan-core/lib/bootstrap/IInjector';
import IRegistry from 'artisan-core/lib/bootstrap/IRegistry';
import SqlServerDatabaseFactory from '../sql/sqlserver/SqlServerDatabaseFactory';

/**
 * Registers the dependencies required for SQL Server integration.
 */
class SqlServerRegistry implements IRegistry {
   public register(injector: IInjector): void {
      injector.register('$sqlDatabaseFactory', SqlServerDatabaseFactory);
   }
}

export default SqlServerRegistry;
