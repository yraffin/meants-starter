/**
 * Represents the module import guard.
 * @class
 */
export class ModuleImportGuard {
    /**
     * Function which prevent from reimporting specific core module
     * @method
     * @param {any} parentModule The parent module to check.
     * @param {string} moduleName The module name to check.
     */
    static throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
        if (parentModule) {
            throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
        }
    }
}
