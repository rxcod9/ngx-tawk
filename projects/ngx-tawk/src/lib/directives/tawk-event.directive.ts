import {Directive, ElementRef, Inject, Input, isDevMode, OnDestroy, Optional} from '@angular/core';
import {TawkEventCategoryDirective} from './tawk-event-category.directive';
import {TawkService} from '../services/tawk.service';
import {TawkActionEnum} from '../enums/tawk-action.enum';
import {NGX_TAWK_SETTINGS_TOKEN} from '../tokens/ngx-tawk-settings-token';
import {ITawkSettings} from '../interfaces/i-tawk-settings';
import {fromEvent, Subscription} from 'rxjs';

@Directive({
  selector: `[tawkEvent]`,
  exportAs: 'tawkEvent'
})
export class TawkEventDirective implements OnDestroy {

  constructor(
    @Optional() private tawkCategoryDirective: TawkEventCategoryDirective,
    private tawkService: TawkService,
    @Inject(NGX_TAWK_SETTINGS_TOKEN) private settings: ITawkSettings,
    private readonly el: ElementRef
  ) {
    this.tawkBind = 'click';
  }

  private bindSubscription?: Subscription;

  @Input() tawkAction: TawkActionEnum | string;
  @Input() tawkLabel: string;
  @Input() label: string;
  @Input() tawkValue: number;
  @Input() tawkInteraction: boolean;
  @Input() tawkEvent: TawkActionEnum | string;

  private _tawkBind: string;

  @Input() set tawkBind (tawkBind: string) {
    if (this.bindSubscription) {
      this.bindSubscription.unsubscribe();
    }

    this._tawkBind = tawkBind;
    this.bindSubscription = fromEvent(this.el.nativeElement, tawkBind).subscribe(() => this.trigger());
  }
  get tawkBind(): string {
    return this._tawkBind;
  }

  ngOnDestroy() {
    if (this.bindSubscription) {
      this.bindSubscription.unsubscribe();
    }
  }

  protected trigger() {
    try {
      // Observação: não é obrigatório especificar uma categoria, uma etiqueta ou um valor. Consulte Eventos padrão do Tawk abaixo.
      // if (!this.$tawkCategoryDirective) {
      //   throw new Error('You must provide a tawkCategory attribute w/ tawkEvent Directive.');
      // }

      if (!this.tawkAction && !this.tawkEvent) {
        throw new Error('You must provide a tawkAction attribute to identify this event.');
      }

      this.tawkService
          .event(
            this.tawkAction || this.tawkEvent,
            (this.tawkCategoryDirective) ? this.tawkCategoryDirective.tawkCategory : undefined,
            this.tawkLabel || this.label,
            this.tawkValue,
            this.tawkInteraction
          );
    } catch (err) {
      this.throw(err);
    }
  }

  protected throw(err: Error) {
    if ((isDevMode() || this.settings.enableTracing) && console && console.warn) {
      console.warn(err);
    }
  }

}
