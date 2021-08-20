import { InjectionToken, inject } from '@angular/core';
import { NGX_WINDOW } from './ngx-window-token';
import { TawkFn } from '../types/tawk.type';
import { DataLayer } from '../types/data-layer.type';
import { NGX_DATA_LAYER } from './ngx-data-layer-token';

/**
 * Check if there is some global function called tawk on Window object, or create an empty function to doesn't brake codes...
 */
export function getTawkFn(window: Window, dataLayer: DataLayer): TawkFn {
  return (window)
    ? window['tawk'] = window['tawk'] || function () {
        dataLayer.push(arguments as any);
      }
    : null;
}

/**
 * Provides an injection token to access Tawk Tawk Function
 */
export const NGX_TAWK_FN = new InjectionToken<TawkFn>('ngx-tawk-fn', {
  providedIn: 'root',
  factory: () => getTawkFn(inject(NGX_WINDOW), inject(NGX_DATA_LAYER))
});
