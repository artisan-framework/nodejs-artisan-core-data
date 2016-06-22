declare module Artisan {
    module Core {
        interface IDisposable {
            dispose(): void;
        }
        
        module Collections {
            module Generic {
                class KeyValuePair<TKey, TValue> {
                    constructor(key: TKey, value: TValue);

                    Key: TKey;
                    Value: TValue;
                }
            }
        }

        module Exceptions {
            class BaseException {
                name: string;
                message: string;
                innerException: Exception;
                constructor(name?: string, message?: string, innerException?: any);
                getErrorDetails(): any;
            }
            
            class Exception extends BaseException {
                constructor(message?: string, innerException?: any);
            }

            class ArgumentException extends BaseException {
                argumentName: string;
                constructor(argumentName: string, message: string);
            }

            class ArgumentNullException extends ArgumentException {
                constructor(argumentName: string);
            }

            class NotImplementedException extends BaseException {
                constructor(message?: string);
            }

            class NotSupportedException extends BaseException {
                constructor(message?: string);
            }

            class Verifier {
                argument: any;
                argumentName: string;
                constructor(argument: any, argumentName: any);
                isNotNull(): Verifier;
                isNotNullOrEmpty(): Verifier;
            }

            class Verify {
                static that(argument: any, argumentName: string): Verifier;
            }
        }

        module Util {
            module Bootstrap {
                interface IInjector {
                    register<T>(key: string, value: new (...args: any[]) => T);
                    registerInstance<T>(key: string, value: T);
                }

                interface IRegistry {
                    register(injector: Artisan.Core.Util.Bootstrap.IInjector): void;
                }

                module Electrolyte {
                    class ElectrolyteInjector implements Artisan.Core.Util.Bootstrap.IInjector {
                        constructor(container: any);

                        register<T>(key: string, value: new (...args: any[]) => T);
                        registerInstance<T>(key: string, value: T);

                        getInstance(key: string);
                    }
                }

                module Intravenous {
                    class IntravenousInjector implements Artisan.Core.Util.Bootstrap.IInjector {
                        constructor(container: any);

                        register<T>(key: string, value: new (...args: any[]) => T);
                        registerInstance<T>(key: string, value: T);

                        getInstance(key: string);
                    }
                }
            }
        }
    }
}
