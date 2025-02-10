// requests.state.ts
import { Request } from '../../models/request.model';

export interface RequestsState {
  requests: Request[];
}

export const initialRequestsState: RequestsState = {
  requests: []
};
