import * as fromRouter from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
  router: fromRouter.RouterReducerState<any>;
}

export const selectRouter = createFeatureSelector<
  State,
  fromRouter.RouterReducerState<any>
>('router');

export const {
  selectQueryParams: selectQueryParamsNgRx,
  selectQueryParam,
  selectRouteParams: selectRouteParamsNgrx,
  selectRouteParam,
  selectRouteData,
  selectUrl
} = fromRouter.getSelectors(selectRouter);

export const selectRouteParams = createSelector(
  selectRouteParamsNgrx,
  params => params || {}
);
export const selectQueryParams = createSelector(
  selectQueryParamsNgRx,
  params => params || {}
);
