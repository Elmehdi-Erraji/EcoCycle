// requests.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { RequestsState, initialRequestsState } from './requests.state';
import * as RequestsActions from './requests.actions';

export const requestsReducer = createReducer(
  initialRequestsState,
  on(RequestsActions.loadRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests
  })),
  on(RequestsActions.addRequestSuccess, (state, { requests }) => ({
    ...state,
    requests
  })),
  on(RequestsActions.updateRequestSuccess, (state, { requests }) => ({
    ...state,
    requests
  })),
  on(RequestsActions.deleteRequestSuccess, (state, { requests }) => ({
    ...state,
    requests
  })),
  on(RequestsActions.updateRequestStatusSuccess, (state, { requests }) => ({
    ...state,
    requests
  }))
);
