// requests.state.ts
import { Request } from '../../models/request.model';

export interface RequestsState {
  requests: Request[];
}

export const initialRequestsState: RequestsState = {
  requests: [] // Initially empty; will be loaded from local storage by an effect.
};
