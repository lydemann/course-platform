import { NgModule } from '@angular/core';
import {
  createAction,
  createFeature,
  createReducer,
  createSelector,
  on,
  props,
  StoreModule,
} from '@ngrx/store';

const REHYDRATE_STORE = 'rehydrateStore';

interface RehydrateStore {
  slices: string[];
}

const initialRehydrateStore: RehydrateStore = {
  slices: [],
};

export const addSlice = createAction(
  '[@trellisorg/ngrx-universal-rehydrate] add store slice(s)',
  props<{ slices: string[] }>()
);

export const rehydrateFeature = createFeature({
  name: REHYDRATE_STORE,
  reducer: createReducer(
    initialRehydrateStore,
    on(addSlice, (state, { slices }) => ({
      ...state,
      slices: [...new Set<string>([...state.slices, ...slices])],
    }))
  ),
});

export const selectStateToTransfer = createSelector(
  (state) => state,
  rehydrateFeature.selectSlices,
  (state, slices) =>
    slices.length > 0
      ? slices.reduce(
          (toTransfer, slice) => ({
            ...toTransfer,
            [slice]: state[slice],
          }),
          {}
        )
      : state
);

@NgModule({
  imports: [StoreModule.forFeature(rehydrateFeature)],
})
export class RehydrateStoreModule {}
