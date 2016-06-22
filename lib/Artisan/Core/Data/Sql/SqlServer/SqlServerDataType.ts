/// <reference path="../../../../../typings/tedious/tedious.d.ts"/>

import { TediousType, TYPES } from 'tedious';
import SqlDataType from '../SqlDataType';

interface ISqlServerDataTypeMapping {
  [type: string]: TediousType;
}

var result: ISqlServerDataTypeMapping = {};

result[SqlDataType.Guid] = TYPES.UniqueIdentifierN;
result[SqlDataType.Byte] = TYPES.TinyInt;
result[SqlDataType.Int16] = TYPES.SmallInt;
result[SqlDataType.Int32] = TYPES.Int;
result[SqlDataType.VarChar] = TYPES.VarChar;
result[SqlDataType.NVarChar] = TYPES.NVarChar;

export default result;
