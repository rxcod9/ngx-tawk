import { Directive, Input } from '@angular/core';

@Directive({
  selector: `[tawkEvent][tawkCategory],
             [tawkCategory]`,
  exportAs: 'tawkCategory'
})
export class TawkEventCategoryDirective {

  constructor() { }

  @Input() tawkCategory: string;

}
