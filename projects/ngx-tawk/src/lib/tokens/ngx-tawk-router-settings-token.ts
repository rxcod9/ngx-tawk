import { InjectionToken } from '@angular/core';
import { ITawkRoutingSettings } from '../interfaces/i-tawk-routing-settings';

/**
 * Provide a Injection Token to global settings.
 */
export const NGX_TAWK_ROUTING_SETTINGS_TOKEN = new InjectionToken<ITawkRoutingSettings>('ngx-tawk-routing-settings', {
  factory: () => ({})
});
