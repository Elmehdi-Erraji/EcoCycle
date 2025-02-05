import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Request } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private requestsSubject = new BehaviorSubject<Request[]>(this.loadRequestsFromStorage());
  requests$ = this.requestsSubject.asObservable(); // Public observable for UI

  constructor() {}

  private loadRequestsFromStorage(): Request[] {
    const storedRequests = localStorage.getItem('requests');
    return storedRequests ? JSON.parse(storedRequests) : [];
  }

  private saveRequestsToStorage(requests: Request[]): void {
    localStorage.setItem('requests', JSON.stringify(requests));
    this.requestsSubject.next(requests); // Notify subscribers of the update
  }

  getRequestsByUser(userId: string): Request[] {
    return this.requestsSubject.value.filter(req => req.userId === userId);
  }

  addRequest(request: Request): boolean {
    const requests = this.requestsSubject.value;

    // Validation: Check user limits
    const userRequests = requests.filter(req => req.userId === request.userId);
    const pendingRequests = userRequests.filter(req => req.status === 'pending');
    const totalWeight = userRequests.reduce((sum, req) => sum + req.weight, 0);

    if (pendingRequests.length >= 3 || totalWeight + request.weight > 10000) {
      return false; // Limit exceeded
    }

    request.id = new Date().getTime(); // Unique ID
    const updatedRequests = [...requests, request];

    this.saveRequestsToStorage(updatedRequests);
    return true;
  }

  deleteRequest(id: number, userId: string): boolean {
    let requests = this.requestsSubject.value;
    const updatedRequests = requests.filter(req => req.id !== id || req.userId !== userId);

    this.saveRequestsToStorage(updatedRequests);
    return true;
  }

  updateRequest(updatedRequest: Request): boolean {
    let requests = this.requestsSubject.value;
    const index = requests.findIndex(req => req.id === updatedRequest.id);

    if (index !== -1) {
      requests[index] = updatedRequest;
      this.saveRequestsToStorage([...requests]); // Update and notify UI
      return true;
    }

    return false;
  }

  loadRequests(): void {
    const updatedRequests = this.loadRequestsFromStorage();
    this.requestsSubject.next(updatedRequests);
  }
}
