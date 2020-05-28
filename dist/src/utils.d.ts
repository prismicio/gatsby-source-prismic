/**
 * Returns a namespaced string intended for logging.
 *
 * @param message Message to namespace.
 *
 * @returns Namespaced message.
 */
export declare const msg: (message: string) => string;
/**
 * Maps key-value tuples of an object to new key-value tuples to create a new
 * object.
 *
 * @param fn Function that maps a key-value tuple to a new key-value tuple.
 * @param obj Object to map to a new object.
 *
 * @returns New object with mapped key-values.
 */
export declare const mapObj: <T1, T2>(fn: (entry: [string, T1]) => [string, T2], obj: {
    [key: string]: T1;
}) => {
    [key: string]: T2;
};
/**
 * Maps key-value tuples of an object to new key-value tuples to create a new
 * object. The mapper function can be async.
 *
 * @param fn Function that maps a key-value tuple to a new key-value tuple.
 * @param obj Object to map to a new object.
 *
 * @returns New object with mapped key-values.
 */
export declare const mapObjP: <T1, T2>(fn: (entry: [string, T1]) => Promise<[string, T2]>, obj: {
    [key: string]: T1;
}) => Promise<{
    [key: string]: T2;
}>;
/**
 * Maps values of an object to new values.
 *
 * @param fn Function that maps a value and key to a new value.
 * @param obj Object to map to a new object.
 *
 * @returns New object with mapped values.
 */
export declare const mapObjVals: <T1, T2>(fn: (val: T1, key: string) => T2, obj: {
    [key: string]: T1;
}) => {
    [key: string]: T2;
};
/**
 * Maps values of an object to new values.
 *
 * @param fn Function that maps a value and key to a new value.
 * @param obj Object to map to a new object.
 *
 * @returns New object with mapped values.
 */
export declare const mapObjValsP: <T1, T2>(fn: (val: T1, key: string) => Promise<T2>, obj: {
    [key: string]: T1;
}) => Promise<{
    [key: string]: T2;
}>;
/**
 * Returns true if the provided object has no keys, false otherwise.
 *
 * @param obj Object to check.
 *
 * @returns `true` if `obj` has no keys, `false` otherwise.
 */
export declare const isEmptyObj: (obj: object) => boolean;
/**
 * Returns a valid GraphQL type name for a Prismic schema.
 *
 * @param apiId API ID of the schema.
 *
 * @returns Type name for the schema.
 */
export declare const buildSchemaTypeName: (apiId: string) => string;
/**
 * Determines whether the current context is the browser.
 *
 * @returns `true` if the current context is the browser, `false` otherwise.
 */
export declare const isBrowser: boolean;
