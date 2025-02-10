// requests.actions.ts
import { createAction, props } from '@ngrx/store';
import { Request } from '../../models/request.model';

// Load requests
export const loadRequests = createAction('[Requests] Load Requests');

export const loadRequestsSuccess = createAction(
  '[Requests] Load Requests Success',
  props<{ requests: Request[] }>()
);

// Add a new request
export const addRequest = createAction(
  '[Requests] Add Request',
  props<{ request: Request }>()
);

export const addRequestSuccess = createAction(
  '[Requests] Add Request Success',
  props<{ requests: Request[] }>()
);

// Update (edit) an existing request
export const updateRequest = createAction(
  '[Requests] Update Request',
  props<{ request: Request }>()
);

export const updateRequestSuccess = createAction(
  '[Requests] Update Request Success',
  props<{ requests: Request[] }>()
);

// Update request status (reserve, complete/validate, reject, start)
export const updateRequestStatus = createAction(
  '[Requests] Update Request Status',
  props<{ requestId: number, status: 'reserved' | 'ongoing' | 'validated' | 'rejected' }>()
);

export const updateRequestStatusSuccess = createAction(
  '[Requests] Update Request Status Success',
  props<{ requests: Request[] }>()
);

// Delete a request
export const deleteRequest = createAction(
  '[Requests] Delete Request',
  props<{ requestId: number, userId?: string }>()
);

export const deleteRequestSuccess = createAction(
  '[Requests] Delete Request Success',
  props<{ requests: Request[] }>()
);
