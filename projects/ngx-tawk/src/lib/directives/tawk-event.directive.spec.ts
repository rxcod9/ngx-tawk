import { TawkEventDirective } from './tawk-event.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgxTawkModule } from '../ngx-tawk.module';
import { TawkService } from '../services/tawk.service';
import { Component } from '@angular/core';
import { TawkActionEnum } from '../enums/tawk-action.enum';

describe('TawkEventDirective', () => {

  @Component({
    selector: 'tawk-host',
    template: `
    <button
      tawkEvent="test-1"
      class="test-1 test-click"
      [tawkAction]="tawkAction"
      [tawkLabel]="tawkLabel"
      [label]="label"
      [tawkValue]="tawkValue"
      [tawkInteraction]="tawkInteraction"></button>
    <button
      tawkEvent="test-2"
      class="test-2 test-focus"
      [tawkAction]="tawkAction"
      [tawkLabel]="tawkLabel"
      [label]="label"
      [tawkValue]="tawkValue"
      [tawkInteraction]="tawkInteraction"
      tawkBind="focus"></button>
    <button
      tawkEvent="test-3"
      class="test-3 test-blur"
      [tawkAction]="tawkAction"
      [tawkLabel]="tawkLabel"
      [label]="label"
      [tawkValue]="tawkValue"
      [tawkInteraction]="tawkInteraction"
      tawkBind="blur"></button>
    <button
      tawkCategory="test-4"
      [tawkEvent]="tawkEvent"
      class="test-4 test-category"
      [tawkAction]="tawkAction"
      [tawkLabel]="tawkLabel"
      [label]="label"
      [tawkValue]="tawkValue"
      [tawkInteraction]="tawkInteraction"></button>
    <button
      tawkEvent="test-5"
      class="test-5 test-custom"
      [tawkAction]="tawkAction"
      [tawkLabel]="tawkLabel"
      [label]="label"
      [tawkValue]="tawkValue"
      [tawkInteraction]="tawkInteraction"
      tawkBind="custom"></button>
    `
  })
  class HostComponent {
    tawkAction: TawkActionEnum | string;
    tawkLabel: string;
    label: string;
    tawkValue: number;
    tawkInteraction: boolean;
    tawkBind = 'click';
    tawkEvent: TawkActionEnum | string;
  }

  let fixture: ComponentFixture<HostComponent>,
      host: HostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxTawkModule
      ],
      declarations: [
        HostComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    // tawkCategory = fixture
    //   .debugElement
    //   .query(c => c.classes['test-4'])
    //   .injector
    //   .get(TawkEventCategoryDirective);
    // tawkEvent = new TawkEventDirective(tawkCategory, TestBed.get(TawkService));
  });

  it('should create an instance', () => {
    debugger;
    const tawkEvent = fixture
      .debugElement
      .query(i => (i.nativeElement as HTMLButtonElement).classList.contains('test-1'))
      .injector
      .get(TawkEventDirective);
    expect(tawkEvent).toBeTruthy();
  });

  it('should call `trigger` on click event', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          spyOnTawk = spyOn(tawk, 'event'),
          input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-click'));

    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith('test-1', undefined, undefined, undefined, undefined);
  });

  it('should call `trigger` on focus event', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          spyOnTawk = spyOn(tawk, 'event'),
          input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-focus'));

    fixture.detectChanges();
    input.nativeElement.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith('test-2', undefined, undefined, undefined, undefined);
  });

  it('should call `trigger on blur event`', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          spyOnTawk = spyOn(tawk, 'event'),
          input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-blur'));

    fixture.detectChanges();
    input.nativeElement.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith('test-3', undefined, undefined, undefined, undefined);
  });

  it('should call `trigger on custom event`', () => {
    const tawk: TawkService = TestBed.inject(TawkService),
      spyOnTawk = spyOn(tawk, 'event'),
      input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-custom'));

    fixture.detectChanges();
    input.nativeElement.dispatchEvent(new CustomEvent('custom'));
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith('test-5', undefined, undefined, undefined, undefined);
  });

  it('should warn a message when try to call a event w/o tawkEvent/tawkAction value', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          spyOnConsole = spyOn(console, 'warn'),
          input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-category'));

    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnConsole).toHaveBeenCalled();
  });

  it('should grab tawkAction and pass to event trigger', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          action = 'action-t',
          spyOnTawk = spyOn(tawk, 'event'),
          input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-category'));

    host.tawkAction = action;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith(action, 'test-4', undefined, undefined, undefined);
  });

  it('should grab tawkEvent and pass to event trigger', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          action = 'action-t',
          spyOnTawk = spyOn(tawk, 'event'),
          input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-category'));

    host.tawkEvent = action;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith(action, 'test-4', undefined, undefined, undefined);
  });

  it('should grab tawkCategory and pass to event trigger', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          action = 'action-t',
          spyOnTawk = spyOn(tawk, 'event'),
          input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-category'));

    host.tawkAction = action;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith(action, 'test-4', undefined, undefined, undefined);
  });

  it('should grab tawkLabel and pass to event trigger', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          action = 'action-t',
          label = 'label-t',
          spyOnTawk = spyOn(tawk, 'event'),
          input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-category'));

    host.tawkAction = action;
    host.tawkLabel = label;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith(action, 'test-4', label, undefined, undefined);
  });

  it('should grab label and pass to event trigger', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          action = 'action-t',
          label = 'label-t',
          spyOnTawk = spyOn(tawk, 'event'),
          input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-category'));

    host.tawkAction = action;
    host.label = label;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith(action, 'test-4', label, undefined, undefined);
  });

  it('should grab tawkValue and pass to event trigger', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          action = 'action-t',
          value = 40,
          spyOnTawk = spyOn(tawk, 'event'),
          input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-category'));

    host.tawkAction = action;
    host.tawkValue = value;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith(action, 'test-4', undefined, value, undefined);
  });

  it('should grab tawkInteraction and pass to event trigger', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          action = 'action-t',
          tawkInteraction = true,
          spyOnTawk = spyOn(tawk, 'event'),
          input = fixture.debugElement.query(e => (e.nativeElement as HTMLButtonElement).classList.contains('test-category'));

    host.tawkAction = action;
    host.tawkInteraction = tawkInteraction;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith(action, 'test-4', undefined, undefined, tawkInteraction);
  });

});
