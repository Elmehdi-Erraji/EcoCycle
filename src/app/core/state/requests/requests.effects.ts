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
    private requestService: RequestService  // Using your RequestService
  ) {}

  // Effect: Load requests from local storage via the BehaviorSubject
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

  // Effect: Add a new request
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

  // Effect: Update (edit) an existing request
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

  // Effect: Update a request's status (for reserve, complete/validate, reject, or start)
  updateRequestStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.updateRequestStatus),
      switchMap(action => {
        // Here, we assume your RequestService already handles status updates internally.
        // For example, if you had implemented reserveRequest, completeCollection, etc.,
        // you would call them here. For now, we assume that the service
        // internally updates the state when these actions are called.
        if (action.status === 'reserved') {
          // Example: this.requestService.reserveRequest(action.requestId);
          // (Ensure such a method exists in your service if needed.)
        } else if (action.status === 'validated') {
          // Example: this.requestService.completeCollection(action.requestId);
        } else if (action.status === 'rejected') {
          // Example: this.requestService.rejectRequest(action.requestId);
        } else if (action.status === 'ongoing') {
          // Example: this.requestService.startCollection(action.requestId);
        }
        // In our simplified example, we assume the above methods are implemented
        // and update the BehaviorSubject. Then we retrieve the updated list:
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
