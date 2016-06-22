declare module Electrolyte {
   interface NodeLoaderOptions {
      dirname: string;
      extensions: string | string[];
   }

   interface Component {
      id: string;
   }

   interface Container {
      loader(prefix: string | Function, fn?: Function, options?: any);
      use(prefix: string | Function, fn?: Function, options?: any);

      node(dirname: string);
      node(options: NodeLoaderOptions);
      node_modules();

      factory(id: string, dependencies: string[], fn: Function, sid?: any);
      singleton(id: string, dependencies: string[], fn: Function, sid?: any);
      constructor(id: string, dependencies: string[], ctor: Function, sid?: any);
      literal(id: string, obj: any, sid?: any);

      create(id: string, parent: Component);
   }
}

declare module "electrolyte" {
   export function loader(prefix: string | Function, fn?: Function, options?: any);
   export function use(prefix: string | Function, fn?: Function, options?: any);

   export function node(dirname: string);
   export function node(options: Electrolyte.NodeLoaderOptions);
   export function node_modules();

   export function factory(id: string, dependencies: string[], fn: Function, sid?: any);
   export function singleton(id: string, dependencies: string[], fn: Function, sid?: any);
   export function constructor(id: string, dependencies: string[], ctor: Function, sid?: any);
   export function literal(id: string, obj: any, sid?: any);

   export function create(id: string, parent: Electrolyte.Component);

   export class Container implements Electrolyte.Container {
      loader(prefix: string | Function, fn?: Function, options?: any);
      use(prefix: string | Function, fn?: Function, options?: any);

      node(dirname: string);
      node(options: Electrolyte.NodeLoaderOptions);
      node_modules();

      factory(id: string, dependencies: string[], fn: Function, sid?: any);
      singleton(id: string, dependencies: string[], fn: Function, sid?: any);
      'constructor'(id: string, dependencies: string[], ctor: Function, sid?: any);
      literal(id: string, obj: any, sid?: any);

      create(id: string, parent: Electrolyte.Component);
   }
}
