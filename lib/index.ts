///<reference path="./typings/node/node.d.ts"/>
///<reference path="./typings/require-all/require-all.d.ts"/>
///<reference path="./typings/artisan/artisan.d.ts"/>
///<reference path="./typings/lodash/lodash.d.ts"/>

import Artisan from 'artisan-framework';
import { merge } from 'lodash';

var requireAll = require('require-all');

var result = requireAll({
   dirname : __dirname + '/Artisan',
   filter  :  /(.+)\.js$/,
   resolve : function (module) {
      return module['default'];
   }
});

merge(Artisan, result);

export default Artisan;
