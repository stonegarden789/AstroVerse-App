/**
 * Safe Environment Variable Accessor
 * 
 * This utility safely attempts to read environment variables from multiple sources
 * to ensure compatibility across:
 * 1. Vite Client (import.meta.env)
 * 2. AI Studio / Node Containers (process.env)
 * 3. Server-Side Rendering (SSR)
 * 
 * It prevents "ReferenceError: import is not defined" or "TypeError: Cannot read properties of undefined"
 * which typically crash applications in non-standard environments.
 */
export const getEnvVar = (key: string): string | undefined => {
    let value: string | undefined = undefined;

    // 1. Try Vite standard (import.meta.env)
    // We use a try-catch block because accessing 'import.meta' in some CommonJS environments throws a SyntaxError
    try {
        // @ts-ignore
        if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
            // @ts-ignore
            value = import.meta.env[key];
        }
    } catch (e) {
        // Ignore errors if import.meta is not supported
    }

    // 2. Fallback to Node/Process (process.env)
    // Used in AI Studio, Docker containers, or polyfilled environments
    if (!value) {
        try {
            if (typeof process !== 'undefined' && process && process.env) {
                value = process.env[key];
            }
        } catch (e) {
            // Ignore errors if process is not defined
        }
    }

    return value;
};