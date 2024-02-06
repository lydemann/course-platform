# @trellisorg/ngrx-universal-rehydrate

Here's a Haiku for you:

```
SSR Is Hard
Why duplicate your app's state
Rehydrate Instead
```

This library will allow you to configure what slices of your NgRx State are transferred from
Angular Universal to the client and loaded into your app's state at state init time.

## Demo

Run

1. `yarn nx run ngrx-universal-rehydrate-demo:serve-ssr`
2. `yarn nx serve ngrx-universal-rehydrate-demo-api`

This will serve the demo project to show that the api call has it's data transferred
from universal to the client. You can see this if you install the Redux DevTools in Chrome.

## Installation

1. `yarn add @trellisorg/ngrx-universal-rehydrate`
2. Add the following to your `AppModule`'s import

```typescript
NgrxUniversalRehydrateBrowserModule.forRoot({});
```

`forRoot` takes a config object in the shape of:

```typescript
export const enum MergeStrategy {
  OVERWRITE = 'overwrite',
  MERGE_OVER = 'mergeOver',
  MERGE_UNDER = 'mergeUnder',
}

export interface NgrxUniversalHydrateConfig {
  stores: string[] | undefined; // Defaults to `undefined`
  disableWarnings: boolean; // Defaults to `false`
  mergeStrategy: MergeStrategy; // Defaults to `MergeStrategy.MERGE_OVER`
}
```

If `stores` is left empty or undefined then the entire store is transferred.

3. Import `NgrxUniversalRehydrateServerModule` into your apps `AppServerModule`

```typescript
import { NgModule } from '@angular/core';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';
import { NgrxUniversalRehydrateServerModule } from '@trellisorg/ngrx-universal-rehydrate/server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    NgrxUniversalRehydrateServerModule.forServer(),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
```
