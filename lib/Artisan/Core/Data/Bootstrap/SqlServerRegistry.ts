///<reference path="../../../../typings/artisan/artisan.d.ts"/>
///<reference path="../../../../typings/artisan/artisan-core.d.ts"/>

import Artisan from 'artisan-framework';
import SqlServerDatabaseFactory from '../Sql/SqlServer/SqlServerDatabaseFactory';

/**
 * Registers the dependencies required for SQL Server integration.
 */
class SqlServerRegistry implements Artisan.Core.Util.Bootstrap.IRegistry {
   register(injector: Artisan.Core.Util.Bootstrap.IInjector): void {
      injector.register('$sqlDatabaseFactory', SqlServerDatabaseFactory);
   }
}

export default SqlServerRegistry;