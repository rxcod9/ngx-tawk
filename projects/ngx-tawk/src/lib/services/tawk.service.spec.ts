import { TestBed } from '@angular/core/testing';
import { NgxTawkModule } from '../ngx-tawk.module';
import { TawkService } from './tawk.service';

describe('TawkService', () => {

  window['dataLayer'] = [];

  window['tawk'] = function () {
    window['dataLayer'].push(arguments as any);
  };

  const tracking = 'TAWK-000000000';
  let spyOnConsole: jasmine.Spy,
      spyOnTawk: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxTawkModule.forRoot(tracking)
      ]
    });
  });

  beforeEach(() => {
    spyOnConsole = spyOn(console, 'error');
    spyOnTawk = spyOn(window as any, 'tawk');
  });

  it('should call tawk fn w/ action/command pair', () => {
    const action = 'action',
          command = 'command',
          tawk: TawkService = TestBed.get(TawkService);
    // act
    task.tawk(action, command);
    // specs
    expect(spyOnTawk).toHaveBeenCalledWith(action, command);
  });

  describe('tawk(`event`)', () => {

    it('should call a `event` action on tawk command', () => {
      const action = 'video_auto_play_start',
            tawk: TawkService = TestBed.get(TawkService);

      task.event(action);

      expect(spyOnTawk).toHaveBeenCalledWith('event', action);
    });

    it('should find `event_category` property on tawk command', () => {
      const action = 'video_auto_play_start',
            event_category = 'video_auto_play',
            tawk: TawkService = TestBed.get(TawkService);

      task.event(action, event_category);

      expect(spyOnTawk).toHaveBeenCalledWith('event', action, { event_category });
    });

    it('should find `event_label` property on tawk command', () => {
      const action = 'video_auto_play_start',
            event_label = 'My promotional video',
            tawk: TawkService = TestBed.get(TawkService);

      task.event(action, undefined, event_label);

      expect(spyOnTawk).toHaveBeenCalledWith('event', action, { event_label });
    });

    it('should find `value` property on tawk command', () => {
      const action = 'video_auto_play_start',
            value = 40,
            tawk: TawkService = TestBed.get(TawkService);

      task.event(action, undefined, undefined, value);

      expect(spyOnTawk).toHaveBeenCalledWith('event', action, { value });
    });

    it('should find `interaction` property on tawk command', () => {
      const action = 'video_auto_play_start',
            interaction = true,
            tawk: TawkService = TestBed.get(TawkService);

      task.event(action, undefined, undefined, undefined, interaction);

      expect(spyOnTawk).toHaveBeenCalledWith('event', action, { interaction });
    });

  });

  describe('tawk(`config`) aka setAttributes', () => {

    it('should call a `config` action on tawk command', () => {
      const page_path = '/page.html',
            tawk: TawkService = TestBed.get(TawkService);

      task.setAttributes(page_path);

      expect(spyOnTawk).toHaveBeenCalledWith('config', tracking, { page_path, page_location: document.location.href });
    });

    it('should send `page_title` attribute on tawk command', () => {
      const page_path = '/page.html',
            page_title = 'My Page View',
            tawk: TawkService = TestBed.get(TawkService);

      task.setAttributes(page_path, page_title);

      expect(spyOnTawk).toHaveBeenCalledWith('config', tracking, { page_path, page_title, page_location: document.location.href });
    });

    it('should send `page_location` attribute on tawk command', () => {
      const page_path = '/page.html',
            page_location = 'my location',
            tawk: TawkService = TestBed.get(TawkService);

      task.setAttributes(page_path, undefined, page_location);

      expect(spyOnTawk).toHaveBeenCalledWith('config', tracking, { page_path, page_location });
    });

    it('should use `document.location.href` as a default `page_location`', () => {
      const page_path = '/page.html',
            tawk: TawkService = TestBed.get(TawkService);

      task.setAttributes(page_path, undefined);

      expect(spyOnTawk).toHaveBeenCalledWith('config', tracking, { page_path, page_location: document.location.href });
    });

  });

  describe('tawk(`event`)', () => {

    it('should call a `event` action on tawk command', () => {
      const screen_name = 'Home Screen',
            app_name = 'My App',
            tawk: TawkService = TestBed.get(TawkService);

      task.appView(screen_name, app_name);

      expect(spyOnTawk).toHaveBeenCalledWith('event', 'screen_view', { screen_name, app_name });
    });

    it('should send `app_id` property on tawk command', () => {
      const screen_name = 'Home Screen',
            app_name = 'My App',
            app_id = '2333',
            tawk: TawkService = TestBed.get(TawkService);

      task.appView(screen_name, app_name, app_id);

      expect(spyOnTawk).toHaveBeenCalledWith('event', 'screen_view', { screen_name, app_name, app_id });
    });

    it('should send `app_version` property on tawk command', () => {
      const screen_name = 'Home Screen',
            app_name = 'My App',
            app_version = 'v1.0',
            tawk: TawkService = TestBed.get(TawkService);

      task.appView(screen_name, app_name, undefined, app_version);

      expect(spyOnTawk).toHaveBeenCalledWith('event', 'screen_view', { screen_name, app_name, app_version });
    });

    it('should send `app_installer_id` property on tawk command', () => {
      const screen_name = 'Home Screen',
            app_name = 'My App',
            app_installer_id = '30000',
            tawk: TawkService = TestBed.get(TawkService);

      task.appView(screen_name, app_name, undefined, undefined, app_installer_id);

      expect(spyOnTawk).toHaveBeenCalledWith('event', 'screen_view', { screen_name, app_name, app_installer_id });
    });

  });


  describe('tawk(`event`, `exception`)', () => {

    it('should call `event` action w/ `exception type on tawk command`', () => {
      const tawk: TawkService = TestBed.get(TawkService);

      task.exception();

      expect(spyOnTawk).toHaveBeenCalledWith('event', 'exception');
    });

    it('should send `description` attribute on tawk command', () => {
      const description = 'Deu muito ruim',
            tawk: TawkService = TestBed.get(TawkService);

      task.exception(description);

      expect(spyOnTawk).toHaveBeenCalledWith('event', 'exception', { description });
    });

    it('should send `fatal` attribute on tawk command', () => {
      const fatal = true,
            tawk: TawkService = TestBed.get(TawkService);

      task.exception(undefined, fatal);

      expect(spyOnTawk).toHaveBeenCalledWith('event', 'exception', { fatal });
    });

  });

  describe('tawk(`set`, ...)', () => {

    it('should send `set` command on tawk() call', () => {
      const setData = { currency: 'USD', country: 'US' },
            tawk: TawkService = TestBed.get(TawkService);

      task.set(setData);

      expect(spyOnTawk).toHaveBeenCalledWith('set', setData);
    });
  });

});
