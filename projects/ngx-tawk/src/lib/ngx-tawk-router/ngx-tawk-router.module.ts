import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NGX_TAWK_ROUTER_INITIALIZER_PROVIDER } from '../initializers/tawk-router.initializer';
import { NgxTawkModule } from '../ngx-tawk.module';
import { ITawkRoutingSettings } from '../interfaces/i-tawk-routing-settings';
import { NGX_TAWK_ROUTING_SETTINGS_TOKEN } from '../tokens/ngx-tawk-router-settings-token';

/**
 * Attach a listener to `NavigationEnd` Router event. So, every time Router finish the page resolution it should call `NavigationEnd` event.
 * We assume that NavigationEnd is the final page resolution and call TAWK `set_attributes` command.
 *
 * To avoid double binds, we also destroy the subscription when de Bootstrap Component is destroied. But, we don't know for sure
 * that this strategy does not cause double bind on multiple bootstrap components.
 *
 * We are using de component's injector reference to resolve Router, sou I hope there is no problem w/ double bing.
 *
 * If you have this problem, I encourage not Use NgxTawkRouterModule and atach the listener on AppComponent initialization.
 *
 * This Module is just a sugar for:
 *
```typescript
constructor(private router: Router) {}
...
ngOnInit() {
  ...
  this.router
    .events
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(event => {
      if (event instanceof NavigationEnd) {
        tawkService.setAttributes(event.urlAfterRedirects, undefined);
      }
    });
```
 */
@NgModule({
  imports: [
    CommonModule,
    NgxTawkModule
  ],
  providers: [
    NGX_TAWK_ROUTER_INITIALIZER_PROVIDER
  ],
  declarations: []
})
export class NgxTawkRouterModule {
  static forRoot(settings?: ITawkRoutingSettings): ModuleWithProviders<NgxTawkRouterModule> {
    return {
      ngModule: NgxTawkRouterModule,
      providers: [
        {
          provide: NGX_TAWK_ROUTING_SETTINGS_TOKEN,
          useValue: settings ?? {}
        }
      ]
    };
  }
}
