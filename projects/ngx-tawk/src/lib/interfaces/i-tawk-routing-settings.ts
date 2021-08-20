/**
 * Provide some custom settings for Automatics Router listener behaviour.
 */
export interface ITawkRoutingSettings {
  /**
   * Exclude the given path to the auto set-attributes trigger.
   *
   * ```ts
   * @NgModule({
   *    imports: [
   *      NgxTawkModule.forRoot(...),
   *      NgxTawkRouterModule.forRoot({ exclude: ['/login', '/internal/*', /regExp/gi] })
   *    ]
   * })
   * AppModule
   * ```
   */
  exclude?: Array<string | RegExp>;

  /**
   * Auto trigger set-attributes only for allowed uris.
   *
   * ```ts
   * @NgModule({
   *    imports: [
   *      NgxTawkModule.forRoot(...),
   *      NgxTawkRouterModule.forRoot({ include: ['/login', '/internal/*', /regExp/gi] })
   *    ]
   * })
   * AppModule
   * ```
   */
  include?: Array<string | RegExp>;
}
