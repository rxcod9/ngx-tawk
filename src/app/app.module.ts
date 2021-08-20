import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxTawkModule, NgxTawkRouterModule } from 'ngx-tawk';
import { environment } from 'src/environments/environment';
import { TestPageAComponent } from './test-page-a/test-page-a.component';
import { TestPageBComponent } from './test-page-b/test-page-b.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    TestPageAComponent,
    TestPageBComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NgxTawkModule.forRoot(environment.tawk),
    NgxTawkRouterModule.forRoot({ include: [ '/page-*' ] }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
