import { InjectionToken } from '@angular/core';
import { ITawkSettings } from '../interfaces/i-tawk-settings';

/**
 * Provide a Injection Token to global settings.
 */
export const NGX_TAWK_SETTINGS_TOKEN = new InjectionToken<ITawkSettings>('ngx-tawk-settings', {
  factory: () => ({ projectId: '', enableTracing: false })
});
