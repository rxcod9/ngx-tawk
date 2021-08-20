import { Provider, APP_INITIALIZER, isDevMode } from '@angular/core';
import { NGX_TAWK_SETTINGS_TOKEN } from '../tokens/ngx-tawk-settings-token';
import { ITawkSettings } from '../interfaces/i-tawk-settings';
import { ITawkCommand } from '../interfaces/i-tawk-command';
import { NGX_TAWK_FN } from '../tokens/ngx-tawk-token';
import { TawkFn } from '../types/tawk.type';
import { DOCUMENT } from '@angular/common';

/**
 * Provide a DI Configuration to attach TAWK Initialization at Angular Startup Cycle.
 */
export const NGX_TAWK_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: TawkInitializer,
  deps: [
    NGX_TAWK_SETTINGS_TOKEN,
    NGX_TAWK_FN,
    DOCUMENT
  ]
};

/**
 * Create a script element on DOM and link it to Tawk tracking code URI.
 * After that, execute exactly same init process as tracking snippet code.
 */
export function TawkInitializer(
  settings: ITawkSettings,
  tawk: TawkFn,
  document: Document
) {
  return async () => {
    if (!settings.projectId) {
      if (!isDevMode()) {
        console.error('Empty tracking code for Tawk. Make sure to provide one when initializing NgxTawkModule.');
      }

      return;
    }

    if (!tawk) {
      if (!isDevMode()) {
        console.error('Was not possible create or read tawk() fn. Make sure this module is running on a Browser w/ access to Window interface.');
      }

      return;
    }

    if (!document) {
      if (!isDevMode()) {
        console.error('Was not possible to access Document interface. Make sure this module is running on a Browser w/ access do Document interface.');
      }
    }

    // Set default tawk.js uri
    settings.uri = settings.uri || `https://embed.tawk.to/${settings.projectId}`;

    // these commands should run first!
    settings.initCommands = settings?.initCommands ?? [];

    // assert config command
    if (!settings.initCommands.find(x => x.command === 'config'))
    {
      settings.initCommands.unshift({ command: 'config', values: [ settings.projectId ] })
    }

    // assert js command
    if (!settings.initCommands.find(x => x.command === 'js'))
    {
      settings.initCommands.unshift({ command: 'js', values: [ new Date() ] })
    }

    for (const command of settings.initCommands) {
      tawk(command.command, ...command.values);
    }

    const s: HTMLScriptElement = document.createElement('script');
    s.async = true;
    s.src = settings.uri;

    if (settings.nonce) {
      s.setAttribute('nonce', settings.nonce);
    }

    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    head.appendChild(s);
  };
}
