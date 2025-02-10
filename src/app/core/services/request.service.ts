import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Request } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private requestsSubject = new BehaviorSubject<Request[]>(this.loadRequestsFromStorage());
  requests$ = this.requestsSubject.asObservable(); // Observable to notify UI

  constructor() {}

  private loadRequestsFromStorage(): Request[] {
    const storedRequests = localStorage.getItem('requests');
    return storedRequests ? JSON.parse(storedRequests) : [];
  }

  private saveRequestsToStorage(requests: Request[]): void {
    localStorage.setItem('requests', JSON.stringify(requests));
    this.requestsSubject.next(requests); // Notify subscribers
  }


  private getTotalWeight(req: Request): number {
    return req.wasteItems.reduce((sum, item) => sum + item.weight, 0);
  }

  getRequestsByUser(userId: string): Request[] {
    return this.requestsSubject.value.filter(req => req.userId === userId);
  }

  addRequest(request: Request): boolean {
    const requests = [...this.requestsSubject.value];
    const userRequests = requests.filter(req => req.userId === request.userId);

    const pendingRequests = userRequests.filter(req => req.status === 'pending');
    if (pendingRequests.length >= 3) {
      return false;
    }

    const userTotalWeight = userRequests.reduce((sum, r) => sum + this.getTotalWeight(r), 0);
    const newRequestWeight = this.getTotalWeight(request);

    if (userTotalWeight + newRequestWeight > 10000) {
      return false;
    }

    request.id = new Date().getTime();

    requests.push(request);
    this.saveRequestsToStorage(requests);
    return true;
  }

  deleteRequest(id: number, userId: string): boolean {
    const requests = [...this.requestsSubject.value];
    const updatedRequests = requests.filter(req => !(req.id === id && req.userId === userId));

    this.saveRequestsToStorage(updatedRequests);
    return true;
  }

  updateRequest(updatedRequest: Request): boolean {
    const requests = [...this.requestsSubject.value];
    const index = requests.findIndex(req => req.id === updatedRequest.id);

    if (index !== -1) {
      requests[index] = updatedRequest;
      this.saveRequestsToStorage(requests);
      return true;
    }
    return false;
  }
}
