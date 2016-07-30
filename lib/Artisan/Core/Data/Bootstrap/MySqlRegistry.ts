///<reference path="../../../../typings/artisan/artisan.d.ts"/>
///<reference path="../../../../typings/artisan/artisan-core.d.ts"/>

import Artisan from 'artisan-framework';
import MySqlDatabaseFactory from '../Sql/MySql/MySqlDatabaseFactory';

/**
 * Registers the dependencies required for MySQL integration.
 */
class MySqlRegistry implements Artisan.Core.Util.Bootstrap.IRegistry {
   register(injector: Artisan.Core.Util.Bootstrap.IInjector): void {
      injector.register('$sqlDatabaseFactory', MySqlDatabaseFactory);
   }
}

export default MySqlRegistry;