import { Injectable, Inject, isDevMode } from '@angular/core';
import { NGX_TAWK_SETTINGS_TOKEN } from '../tokens/ngx-tawk-settings-token';
import { ITawkSettings } from '../interfaces/i-tawk-settings';
import { TawkActionEnum } from '../enums/tawk-action.enum';
import { DOCUMENT } from '@angular/common';
import { NGX_TAWK_FN } from '../tokens/ngx-tawk-token';
import { TawkFn } from '../types/tawk.type';

@Injectable({
  providedIn: 'root'
})
export class TawkService {

  private get document(): Document {
    return this._document;
  }

  constructor(
    @Inject(NGX_TAWK_SETTINGS_TOKEN) private readonly settings: ITawkSettings,
    @Inject(DOCUMENT) private readonly _document: any,
    @Inject(NGX_TAWK_FN) private readonly _tawk: TawkFn
  ) { }

  private throw(err: Error) {
    if ((this.settings.enableTracing || isDevMode()) && console && console.error) {
      console.error(err);
    }
  }

  /** @todo Change this to `Object.fromEntity()` in the future... */
  private toKeyValue(map: Map<string, any>): { [param: string]: any } | void {
    return (map.size > 0)
      ? Array.from(map).reduce(
        (obj, [key, value]) => Object.defineProperty(obj, key, { value, enumerable: true }),
        {}
      )
      : undefined;
  }

  /**
   * Call native TAWK Tag
   */
  tawk(...args: any[]) {
    try {
      this._tawk(...args.filter(x => x !== undefined));
    } catch (err) {
      this.throw(err);
    }
  }

  /**
   * Send an event trigger to TAWK. It is the same as call:
   * ```js
   * tawk('event', 'video_auto_play_start', {
   *   'event_label': 'My promotional video',
   *   'event_category': 'video_auto_play'
   * });
   * ```
   *
   * @param action 'video_auto_play_start'
   * @param category 'video_auto_play'
   * @param label 'My promotional video'
   * @param value An value to measure something
   */
  event(action: TawkActionEnum | string, category?: string, label?: string, value?: number, interaction?: boolean) {
    try {
      const opt = new Map<string, any>();
      if (category) {
        opt.set('event_category', category);
      }
      if (label) {
        opt.set('event_label', label);
      }
      if (value) {
        opt.set('value', value);
      }
      if (interaction !== undefined) {
        opt.set('interaction', interaction);
      }
      const params = this.toKeyValue(opt);
      if (params) {
        this.tawk('event', action as string, params);
      } else {
        this.tawk('event', action as string);
      }
    } catch (error) {
      this.throw(error);
    }
  }

  /**
   * Send an page view event. This is the same as
   *
   * ```js
   * tawk('config', 'TAWK_TRACKING_ID', {
   *   'page_title' : 'Homepage',
   *   'page_path': '/home'
   * });
   * ```
   *
   * The tracking ID is injected automatically by Inject Token NGX_TAWK_SETTINGS_TOKEN
   *
   * @param path /home
   * @param title Homepage
   * @param location '{ page_location }'
   * @param options '{ ... custom dimentions }'
   */
  setAttributes( path: string, title?: string, location?: string, options?: Object) {
    try {
      const opt = new Map<string, any>([['page_path', path]]);
      if (title) {
        opt.set('page_title', title);
      }
      if (location || this.document) {
        opt.set('page_location', (location || this.document.location.href));
      }
      if (options) {
        Object
          .entries(options)
          .map(([key, value]) => opt.set(key, value));
      }
      this.tawk('config', this.settings.projectId, this.toKeyValue(opt));
    } catch (error) {
      this.throw(error);
    }
  }

  /**
   * Send an event to report a App Page View. It is the same as
   *
   * ```js
   * tawk('event', 'screen_view', {
   *   'app_name': 'myAppName',
   *   'screen_name' : 'Home'
   * });
   *
   * ```
   *
   * @param screen 'screen_name'
   * @param appName 'app_name'
   * @param appId 'app_id'
   * @param appVersion 'app_version'
   * @param installerId 'app_installer_id'
   */
  appView(screen: string, appName: string, appId?: string, appVersion?: string, installerId?: string) {
    try {
      const opt = new Map<string, any>([['screen_name', screen], ['app_name', appName]]);
      if (appId) {
        opt.set('app_id', appId);
      }
      if (appVersion) {
        opt.set('app_version', appVersion);
      }
      if (installerId) {
        opt.set('app_installer_id', installerId);
      }
      this.tawk('event', 'screen_view', this.toKeyValue(opt));
    } catch (error) {
      this.throw(error);
    }
  }

  /**
   * Defines persistent values on Tawk
   *
   * @see https://developers.tawk.com/analytics/devguides/collection/tawkjs/setting-values
   *
   * ```js
   * tawk('set', {
   *   'currency': 'USD',
   *   'country': 'US'
   * });
   * ```
   */
  set(...options: Array<any>) {
    try {
      this._tawk('set', ...options);
    } catch (err) {
      this.throw(err);
    }
  }

  /**
   * Send an event to TAWK to report an application error. It is the same as
   *
   * ```js
   * tawk('event', 'exception', {
   *   'description': 'error_description',
   *   'fatal': false   // set to true if the error is fatal
   * });
   * ```
   *
   * @param description 'error_description'
   * @param fatal set to true if the error is fatal
   */
  exception(description?: string, fatal?: boolean) {
    try {
      const opt = new Map<string, any>();
      if (description) {
        opt.set('description', description);
      }
      if (fatal) {
        opt.set('fatal', fatal);
      }
      const params = this.toKeyValue(opt);
      if (params) {
        this.tawk('event', 'exception', this.toKeyValue(opt));
      } else {
        this.tawk('event', 'exception');
      }
    } catch (error) {
      this.throw(error);
    }
  }
}
