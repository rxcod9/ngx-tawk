import { ComponentRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TawkService } from '../services/tawk.service';
import { TawkRouterInitializer } from './tawk-router.initializer';

describe('tawkRouterInitializer(settings, tawkService)', () => {

  function fakeTransform<Dest>(obj: Partial<Dest>): Dest {
    return obj as any;
  }

  let tawkService: TawkService,
      spyOnTawkService: jasmine.Spy,
      router$: Subject<any>,
      router: Router,
      component: ComponentRef<any>;

  beforeEach(() => {
    tawkService = TestBed.inject(TawkService),
    spyOnTawkService = spyOn(tawkService, 'setAttributes'),
    router$ = new Subject<any>(),
    router = fakeTransform<Router>({
      events: router$
    }),
    component = fakeTransform<ComponentRef<any>>({
      injector: fakeTransform<Injector>({
        get: () => router
      }),
      onDestroy: () => {}
    });
  });

  it('should not trigger the first route event', async () => {
    const factory = await TawkRouterInitializer(null, tawkService)(component);

    // act
    router$.next(new NavigationStart(1, '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));

    // asserts
    expect(spyOnTawkService).toHaveBeenCalledTimes(1);
  });

  it('should trigger the second route event', async () => {
    const factory = await TawkRouterInitializer(null, tawkService)(component);

    // act
    router$.next(new NavigationStart(1, '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));

    // asserts
    expect(spyOnTawkService).toHaveBeenCalledTimes(1);
    expect(spyOnTawkService).toHaveBeenCalledWith('/test', undefined);
  });

  it('should trigger only included route', async () => {
    const factory = await TawkRouterInitializer({ include: [ '/test' ] }, tawkService)(component);

    // act
    router$.next(new NavigationStart(1, '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));
    router$.next(new NavigationStart(1, '/test1'));
    router$.next(new NavigationEnd(1, '/test1', '/test1'));
    router$.next(new NavigationStart(1, '/test2'));
    router$.next(new NavigationEnd(1, '/test2', '/test2'));

    // asserts
    expect(spyOnTawkService).toHaveBeenCalledTimes(1);
    expect(spyOnTawkService).toHaveBeenCalledWith('/test', undefined);
  });

  it('should not trigger excluded route', async () => {
    const factory = await TawkRouterInitializer({ exclude: [ '/test' ] }, tawkService)(component);

    // act
    router$.next(new NavigationStart(1, '/test1'));
    router$.next(new NavigationEnd(1, '/test1', '/test1'));
    router$.next(new NavigationStart(1, '/test2'));
    router$.next(new NavigationEnd(1, '/test2', '/test2'));
    router$.next(new NavigationStart(1, '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));

    // asserts
    expect(spyOnTawkService).toHaveBeenCalledTimes(1);
    expect(spyOnTawkService).toHaveBeenCalledWith('/test2', undefined);
  });

  it('should work w/ include and exclude router', async () => {
    const factory = await TawkRouterInitializer({
      include: [ '/test*' ],
      exclude: [ '/test-2' ] },
      tawkService
    )(component);

    // act
    router$.next(new NavigationStart(1, '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));
    router$.next(new NavigationStart(1, '/test-2'));
    router$.next(new NavigationEnd(1, '/test-2', '/test-2'));

    // asserts
    expect(spyOnTawkService).toHaveBeenCalledTimes(1);
    expect(spyOnTawkService).toHaveBeenCalledWith('/test-1', undefined);
  });

  it('should match simple uri', async () => {
    const factory = await TawkRouterInitializer({
      include: [ '/test-1' ] },
      tawkService
    )(component);

    // act
    router$.next(new NavigationStart(1, '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));

    // asserts
    expect(spyOnTawkService).toHaveBeenCalledTimes(1);
    expect(spyOnTawkService).toHaveBeenCalledWith('/test-1', undefined);
  });

  it('should match wildcard uri', async () => {
    const factory = await TawkRouterInitializer(
      {
        include: [ '/test*' ]
      },
      tawkService
    )(component);

    // act
    router$.next(new NavigationStart(1, '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));

    // asserts
    expect(spyOnTawkService).toHaveBeenCalledTimes(1);
    expect(spyOnTawkService).toHaveBeenCalledWith('/test-1', undefined);
  });

  it('should match RegExp uri', async () => {
    const factory = await TawkRouterInitializer({
      include: [ new RegExp('/test.*', 'i') ] },
      tawkService
    )(component);

    // act
    router$.next(new NavigationStart(1, '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));

    // asserts
    expect(spyOnTawkService).toHaveBeenCalledTimes(1);
    expect(spyOnTawkService).toHaveBeenCalledWith('/test-1', undefined);
  });

});
