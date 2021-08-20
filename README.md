# Ngx Google Analytics

An easy implementation to track tawk on angular8+ apps.

Feedbacks on https://github.com/rxcod9/ngx-tawk

![Build and Tests](https://github.com/rxcod9/ngx-tawk/workflows/Build%20and%20Tests/badge.svg)

# Notice

I'm investing a big amount of time studing new technologies for my daily job, and I am not able to invest a significant amount of time into maintaining `ngx-tawk` properly. I am looking for volunteers who would like to become active maintainers on the project. If you are interested, please shoot me a note.

# Index

* [Setup](#setup)
  * [NPM](#npm)
  * [Simple Setup](#simple-setup)
  * [Routing Setup](#setup-routing-module)
  * [Advanced Routing Setup](#advanced-setup-routing-module)
* [TawkServie](#tawkservice)
* [Directives](#directives)
* [Changelog](CHANGELOG.md)

## Setup

### NPM

To setup this package on you project, just call the following command.

```
npm install ngx-tawk
```

### Simple Setup

On your Angular Project, you shall include the `NgxTawkModule` on your highest level application module. ie `AddModule`. The easiest install mode call the `forRoot()` method and pass the GA tracking code.

```ts
import { NgxTawkModule } from 'ngx-tawk';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxTawkModule.forRoot('project-id')
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Setup Routing Module

We provide a second Module Dependency to configure Router Event Bindings and perform automatic page view every time your application navigates to another page.

Add ```NgxTawkRouterModule``` on AppModule enable auto track `Router` events.

**IMPORTANT:** This Module just subscribe to Router events when the bootstrap component is created, and then cleans up any subscriptions related to previous component when it is destroyed. You may get some issues if using this module on a server side rendering or multiple bootstrap components. If it is your case, I suggest you subscribe to events by yourself. You can use git repository as reference.

```ts
import { NgxTawkModule, NgxTawkRouterModule } from 'ngx-tawk';
...

@NgModule({
  ...
  imports: [
    ...
    NgxTawkModule.forRoot(environment.tawk),
    NgxTawkRouterModule
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ]
})
export class AppModule {}
```

### Advanced Setup Routing Module

You can customize some rules to include/exclude routes on `NgxTawkRouterModule`. The include/exclude settings allow:
* Simple route match: `{ include: [ '/full-uri-match' ] }`;
* Wildcard route match: `{ include: [ '*/public/*' ] }`;
* Regular Expression route match: `{ include: [ /^\/public\/.*/ ] }`;

```ts
import { NgxTawkModule, NgxTawkRouterModule } from 'ngx-tawk';
...

@NgModule({
  ...
  imports: [
    ...
    NgxTawkModule.forRoot(environment.tawk),
    NgxTawkRouterModule.forRoot({ include: [...], exclude: [...] })
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ]
})
export class AppModule {}
```


## TawkService

This service provides an easy and strong typed way to call `gtag()` command. It does nothing else then convert a strong typed list of arguments into a standard `gtag` api call.

### Call Interface Events

```ts
@Component( ... )
export class TestFormComponent {

  constructor(
    private $tawkService: TawkService
  ) {}

  onUserInputName() {
    ...
    this.$tawkService.event('enter_name', 'user_register_form', 'Name');
  }

  onUserInputEmail() {
    ...
    this.$tawkService.event('enter_email', 'user_register_form', 'Email');
  }

  onSubmit() {
    ...
    this.$tawkService.event('submit', 'user_register_form', 'Enviar');
  }

}
```

### Call GA Page Views and Virtual Page Views

```ts
@Component(...)
export class TestPageComponent implements OnInit {

  constructor(
    protected $tawkService: TawkService
  ) {}

  ngOnInit() {
    this.$tawkService.setAttributes('/teste', 'Teste de Title')
  }

  onUserLogin() {
    ...
    this.$tawkService.setAttributes('/teste', 'Teste de Title', undefined, {
      user_id: 'my-user-id'
    })
  }

}
```

## Directives

In a way to help you to be more productive on attach GA events on UI elements. We create some directives to handle `TawkService` and add event listener by simple attributes.

### Simple directive use

The default behaviour is call `gtag` on click events, but you can change the trigger to any HTML Event (e.g. `focus`, `blur` or custom events) as well.

```js
<div>
  <button tawkEvent="click_test" tawkCategory="tawk_directive_test">Click Test</button>
  <button tawkEvent="focus_test" tawkCategory="tawk_directive_test" tawkBind="focus">Focus Test</button>
  <button tawkEvent="blur_test" tawkCategory="tawk_directive_test" tawkBind="blur">Blur Test</button>
  <button tawkEvent="custom_test" tawkCategory="tawk_directive_test" tawkBind="customEvent">Custom Event Test</button>
</div>
```

### Simple input use

If you attach tawkEvent directive on form elements, it will assume focus event as default `trigger`.

```js
<div>
  <input tawkEvent="fill_blur" tawkCategory="tawk_directive_input_test" placeholder="Auto Blur Test">
</div>
```

### Grouped directives

Sometime your UX guy want to group several elements in the interface at same group to help his analysis and reports. Fortunaly the `tawkCategory` directive can be placed on the highest level group element and all child `tawkEvent` will assume the parent `tawkCategory` as their parent.

```js
<div tawkCategory="tawk_test_category">
  <button tawkEvent tawkAction="click_test">Click Test</button>
  <button tawkEvent tawkAction="focus_test" tawkBind="focus">Focus Test</button>
  <button tawkEvent tawkAction="blur_test" tawkBind="blur">Blur Test</button>
</div>
```

