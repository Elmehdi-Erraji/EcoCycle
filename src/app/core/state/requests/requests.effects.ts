// requests.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RequestsActions from './requests.actions';
import { RequestService } from '../../services/request.service';
import { switchMap, map, take } from 'rxjs/operators';

@Injectable()
export class RequestsEffects {
  constructor(
    private actions$: Actions,
    private requestService: RequestService
  ) {}

  loadRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.loadRequests),
      switchMap(() =>
        this.requestService.requests$.pipe(
          take(1),
          map(requests => RequestsActions.loadRequestsSuccess({ requests }))
        )
      )
    )
  );

  addRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.addRequest),
      switchMap(action => {
        // Call your service method that adds the request (this method returns a boolean)
        const success = this.requestService.addRequest(action.request);
        // After adding, get the updated list from the BehaviorSubject
        return this.requestService.requests$.pipe(
          take(1),
          map(requests => RequestsActions.addRequestSuccess({ requests }))
        );
      })
    )
  );

  updateRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.updateRequest),
      switchMap(action => {
        const success = this.requestService.updateRequest(action.request);
        return this.requestService.requests$.pipe(
          take(1),
          map(requests => RequestsActions.updateRequestSuccess({ requests }))
        );
      })
    )
  );

  updateRequestStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.updateRequestStatus),
      switchMap(action => {

        if (action.status === 'reserved') {

        } else if (action.status === 'validated') {
        } else if (action.status === 'rejected') {
        } else if (action.status === 'ongoing') {
        }

        return this.requestService.requests$.pipe(
          take(1),
          map(requests => RequestsActions.updateRequestStatusSuccess({ requests }))
        );
      })
    )
  );

  // Effect: Delete a request
  deleteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.deleteRequest),
      switchMap(action => {
        this.requestService.deleteRequest(action.requestId, action.userId || '');
        return this.requestService.requests$.pipe(
          take(1),
          map(requests => RequestsActions.deleteRequestSuccess({ requests }))
        );
      })
    )
  );
}
