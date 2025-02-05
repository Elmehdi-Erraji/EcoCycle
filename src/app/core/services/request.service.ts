import { Injectable } from '@angular/core';
import { Request } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private localStorageKey = 'collectRequests';

  constructor() {}

  // Get all requests for a specific user
  getRequestsByUser(userId: string): Request[] {
    const requests: Request[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    return requests.filter(req => req.userId === userId);
  }

  // Add a new request
  addRequest(newRequest: Request): boolean {
    let requests: Request[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');

    // Ensure the user has max 3 active requests (pending)
    const userRequests = requests.filter(r => r.userId === newRequest.userId);
    const activeRequests = userRequests.filter(r => r.status === 'pending');

    if (activeRequests.length >= 3) {
      return false; // Limit reached
    }

    // Ensure total weight does not exceed 10kg (10000 grams)
    const totalWeight = activeRequests.reduce((sum, r) => sum + r.weight, 0) + newRequest.weight;
    if (totalWeight > 10000) {
      return false; // Max weight reached
    }

    // Assign a unique ID
    newRequest.id = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
    newRequest.status = 'pending'; // Default status

    // Save the request
    requests.push(newRequest);
    localStorage.setItem(this.localStorageKey, JSON.stringify(requests));
    return true;
  }

  // Delete a request (only if it's still pending)
  deleteRequest(requestId: number, userId: string): boolean {
    let requests: Request[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    const requestIndex = requests.findIndex(r => r.id === requestId && r.userId === userId);

    if (requestIndex === -1 || requests[requestIndex].status !== 'pending') {
      return false; // Can't delete non-pending requests
    }

    requests.splice(requestIndex, 1);
    localStorage.setItem(this.localStorageKey, JSON.stringify(requests));
    return true;
  }

  // Update an existing request (only if it's still pending)
  updateRequest(updatedRequest: Request): boolean {
    let requests: Request[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    const index = requests.findIndex(r => r.id === updatedRequest.id && r.userId === updatedRequest.userId);

    if (index === -1 || requests[index].status !== 'pending') {
      return false; // Can't update non-pending requests
    }

    requests[index] = updatedRequest;
    localStorage.setItem(this.localStorageKey, JSON.stringify(requests));
    return true;
  }
}
