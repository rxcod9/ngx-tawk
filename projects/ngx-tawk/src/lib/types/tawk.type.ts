/**
 * Tawk TawkFn call signature
 */
export type TawkFn = (...args: (string | { [param: string]: string })[]) => {};
