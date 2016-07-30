/// <reference path="../../../../../typings/artisan/artisan.d.ts" />
/// <reference path="../../../../../typings/artisan/artisan-core.d.ts" />

import Artisan from 'artisan-framework';
import ISqlParameter from '../ISqlParameter';
import Verify = Artisan.Core.Exceptions.Verify;

/**
 * SqlParameter is a standard implementation of ISqlParameter.
 */
class SqlParameter implements ISqlParameter {
   /**
    * Creates a new instance.
    */
   constructor(name: string, type: string, value: any) {
      Verify.that(name, 'name').isNotNullOrEmpty();
      Verify.that(type, 'type').isNotNullOrEmpty();
      
      this.Name = name;
      this.Type = type;
      this.Value = value;
   }

   public Name: string;
   public Type: string;
   public Value: any;
}

export default SqlParameter;