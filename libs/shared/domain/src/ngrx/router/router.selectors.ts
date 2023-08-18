import { ActivatedRouteSnapshot } from '@angular/router';
import * as fromRouter from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
  router: fromRouter.RouterReducerState;
}

export const selectRouter = createFeatureSelector<
  State,
  fromRouter.RouterReducerState
>('router');

export const {
  selectQueryParams: selectQueryParamsNgRx,
  selectQueryParam,
  selectRouteData,
  selectUrl
} = fromRouter.getRouterSelectors(selectRouter);

const getRouteParams = (route: ActivatedRouteSnapshot) => {
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
  };
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
