import { Provider, APP_BOOTSTRAP_LISTENER, ComponentRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ITawkRoutingSettings } from '../interfaces/i-tawk-routing-settings';
import { TawkService } from '../services/tawk.service';
import { NGX_TAWK_ROUTING_SETTINGS_TOKEN } from '../tokens/ngx-tawk-router-settings-token';
import { filter, skip } from 'rxjs/operators';

/**
 * Provide a DI Configuration to attach TAWK Trigger to Router Events at Angular Startup Cycle.
 */
export const NGX_TAWK_ROUTER_INITIALIZER_PROVIDER: Provider = {
  provide: APP_BOOTSTRAP_LISTENER,
  multi: true,
  useFactory: TawkRouterInitializer,
  deps: [
    NGX_TAWK_ROUTING_SETTINGS_TOKEN,
    TawkService
  ]
};

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
 */
export function TawkRouterInitializer(
  settings: ITawkRoutingSettings,
  tawkService: TawkService
) {
  return async (c: ComponentRef<any>) => {
    const router = c.injector.get(Router);
    const { include = [], exclude = [] } = settings ?? {};
    const includeRules = normalizePathRules(include);
    const excludeRules = normalizePathRules(exclude);
    const subs = router
      .events
      .pipe(
        filter((event: NavigationEnd) => event instanceof NavigationEnd),
        skip(1), // Prevend double views on the first tigger (because TAWK Already send one ping on setup)
        filter(event => includeRules.length > 0
          ? includeRules.some(rule => rule.test(event.urlAfterRedirects))
          : true),
        filter(event => excludeRules.length > 0
          ? !excludeRules.some(rule => rule.test(event.urlAfterRedirects))
          : true)
      )
      .subscribe(event => tawkService.setAttributes(event.urlAfterRedirects, undefined));
    // Cleanup
    c.onDestroy(() => subs.unsubscribe());
  };
}

/** Converts all path rules from string to Regex instances */
function normalizePathRules(rules: Array<string | RegExp>): Array<RegExp> {
  return rules.map(rule => (rule instanceof RegExp)
    ? rule
    : new RegExp(`^${rule.replace('*', '.*')}$`, 'i'));
}
