import Verify from 'artisan-core/lib/exceptions/Verify';
import ISqlParameter from '../ISqlParameter';

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
