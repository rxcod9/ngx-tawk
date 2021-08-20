import { TawkEventFormInputDirective } from './tawk-event-form-input.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgxTawkModule } from '../ngx-tawk.module';
import { TawkEventDirective } from './tawk-event.directive';
import { TawkEventCategoryDirective } from './tawk-event-category.directive';
import { TawkService } from '../services/tawk.service';
import { Component } from '@angular/core';
import { NGX_TAWK_SETTINGS_TOKEN } from '../tokens/ngx-tawk-settings-token';

describe('TawkEventFormInputDirective', () => {

  @Component({
    selector: 'tawk-host',
    template: `<input tawkEvent="teste">`
  })
  class HostComponent {}

  let tawkEventFormInput: TawkEventFormInputDirective,
      tawkEvent: TawkEventDirective,
      tawkCategory: TawkEventCategoryDirective,
      host: HostComponent,
      fixture: ComponentFixture<HostComponent>;

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
    fixture.detectChanges();
  });

  beforeEach(() => {
    tawkCategory = new TawkEventCategoryDirective();
    tawkEvent = new TawkEventDirective(tawkCategory, TestBed.get(TawkService), TestBed.get(NGX_TAWK_SETTINGS_TOKEN), fixture.elementRef);
    tawkEventFormInput = new TawkEventFormInputDirective(tawkEvent);
  });

  it('should create an instance', () => {
    expect(tawkEventFormInput).toBeTruthy();
  });

  it('should update tawkBind when input is updated', () => {
    tawkEventFormInput.tawkBind = 'click';
    expect(tawkEvent.tawkBind).toBe('click');
  });

  it('should use `focus` as a default tawkBind', () => {
    expect(tawkEvent.tawkBind).toBe('focus');
  });

  it('should call `TawkService.event()` on trigger focus at input', () => {
    const tawk: TawkService = TestBed.get(TawkService),
          spyOnTawk = spyOn(tawk, 'event'),
          input = fixture.debugElement.query(e => e.name === 'input');

    fixture.detectChanges();
    input.nativeElement.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(spyOnTawk).toHaveBeenCalledWith('teste', undefined, undefined, undefined, undefined);
  });
});
