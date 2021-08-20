import { NgModule, ModuleWithProviders } from '@angular/core';
import { ITawkCommand } from './interfaces/i-tawk-command';
import { NGX_TAWK_INITIALIZER_PROVIDER } from './initializers/tawk.initializer';
import { NGX_TAWK_SETTINGS_TOKEN } from './tokens/ngx-tawk-settings-token';
import { TawkEventDirective } from './directives/tawk-event.directive';
import { TawkEventCategoryDirective } from './directives/tawk-event-category.directive';
import { TawkEventFormInputDirective } from './directives/tawk-event-form-input.directive';
import { ITawkSettings } from './interfaces/i-tawk-settings';

/**
 * Install Tawk Tracking code on your environment and configure tracking ID.
 *
 * This module should be a dependency on the highest level module of the application, i.e. AppModule in most use cases.
 */
@NgModule({
  imports: [
  ],
  declarations: [
    TawkEventDirective,
    TawkEventCategoryDirective,
    TawkEventFormInputDirective
  ],
  exports: [
    TawkEventDirective,
    TawkEventCategoryDirective,
    TawkEventFormInputDirective
  ]
})
export class NgxTawkModule {
  /**
   * You should provide a valid Tawk ProjectId. This code will be provided to the entire application by
   * `NGX_TAWK_SETTINGS_TOKEN` token. You can inject this code in you components if you like by
   * use the following injection code `@Inject(NGX_TAWK_SETTINGS_TOKEN) tawkConfig: ITawkSettings`
   *
   * @param projectId The Tawk ProjectId
   * @param initCommands When placed, it will run any TAWK Commands in sequence after setup TAWK environment.
   * @param uri When placed, it will change the default js URI to the provided one.
   * @param enableTracing When true, trace TAWK tracking errors on production mode.
   * @param nonce When placed, nonce will be added to script tag.
   */
  static forRoot(projectId: string, initCommands: ITawkCommand[] = [], uri?: string, enableTracing?: boolean, nonce?: string): ModuleWithProviders<NgxTawkModule> {
    return {
      ngModule: NgxTawkModule,
      providers: [
        {
          provide: NGX_TAWK_SETTINGS_TOKEN,
          useValue: {
            projectId,
            initCommands,
            uri,
            enableTracing,
            nonce
          } as ITawkSettings
        },
        NGX_TAWK_INITIALIZER_PROVIDER,
      ]
    };
  }
}
