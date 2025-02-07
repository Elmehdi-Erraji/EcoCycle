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

  /**
   * Helper to sum up total weight in a Request by adding all wasteItems.
   */
  private getTotalWeight(req: Request): number {
    return req.wasteItems.reduce((sum, item) => sum + item.weight, 0);
  }

  getRequestsByUser(userId: string): Request[] {
    return this.requestsSubject.value.filter(req => req.userId === userId);
  }

  addRequest(request: Request): boolean {
    const requests = [...this.requestsSubject.value];
    const userRequests = requests.filter(req => req.userId === request.userId);

    // Check if user already has >= 3 pending requests
    const pendingRequests = userRequests.filter(req => req.status === 'pending');
    if (pendingRequests.length >= 3) {
      // Already have 3 pending requests; block this one
      return false;
    }

    // Check if adding this request will exceed 10kg total
    const userTotalWeight = userRequests.reduce((sum, r) => sum + this.getTotalWeight(r), 0);
    const newRequestWeight = this.getTotalWeight(request);

    if (userTotalWeight + newRequestWeight > 10000) {
      // Exceeds 10kg
      return false;
    }

    // Assign a unique ID (timestamp for simplicity)
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
