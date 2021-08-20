import { Directive, Host, Optional, Input } from '@angular/core';
import { TawkEventDirective } from './tawk-event.directive';

@Directive({
  selector: `input[tawkEvent],
             select[tawkEvent],
             textarea[tawkEvent]`
})
export class TawkEventFormInputDirective {

  constructor(
    @Host() @Optional() protected tawkEvent: TawkEventDirective
  ) {
    this.tawkBind = 'focus';
  }

  @Input() set tawkBind(bind: string) {
    if (this.tawkEvent) {
      this.tawkEvent.tawkBind = bind;
    }
  }

}
