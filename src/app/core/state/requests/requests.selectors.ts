// requests.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RequestsState } from './requests.state';

export const selectRequestsState = createFeatureSelector<RequestsState>('requests');

export const selectAllRequests = createSelector(
  selectRequestsState,
  (state: RequestsState) => state.requests
);

// Selector for individual users
export const selectRequestsByUser = (userId: string) => createSelector(
  selectAllRequests,
  (requests) => requests.filter(req => req.userId === userId)
);
