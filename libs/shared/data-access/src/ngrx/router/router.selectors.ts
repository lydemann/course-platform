import { ActivatedRouteSnapshot } from '@angular/router';
import * as fromRouter from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
  router: fromRouter.RouterReducerState;
}

export const selectRouter = createFeatureSelector<
  fromRouter.RouterReducerState
>('router');

export const {
  selectQueryParams: selectQueryParamsNgRx,
  selectQueryParam,
  selectRouteData,
  selectUrl
} = fromRouter.getSelectors(selectRouter);

const getRouteParams = (route: ActivatedRouteSnapshot): Record<string, string> => {
  if (route.children.length === 0) {
    return route.params;
  }

  const combinedChildParams = route.children.reduce(
    (prev, childRoute) => ({ ...prev, ...getRouteParams(childRoute) }),
    {}
  );
  return {
    ...route.params,
    ...combinedChildParams
  } as Record<string, string>;
};

export const selectRouteParams = createSelector(selectRouter, routerState => {
  if (!routerState?.state?.root) {
    return {};
  }

  return getRouteParams(routerState.state.root);
});

export const selectRouteParam = (routeParam: string) =>
  createSelector(selectRouteParams, routeParams => {
    return routeParams[routeParam];
  });

export const selectQueryParams = createSelector(
  selectQueryParamsNgRx,
  params => params || {}
);
