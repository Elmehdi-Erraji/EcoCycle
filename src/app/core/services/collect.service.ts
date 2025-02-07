import { Injectable } from '@angular/core';
import { Request, WasteItem } from '../models/request.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CollectService {
  private requestsKey = 'requests';
  private currentUserKey = 'currentUser';
  private usersKey = 'users';

  constructor() {}

  // Retrieve all requests from local storage
  getRequests(): Request[] {
    const stored = localStorage.getItem(this.requestsKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Get collector's city from the currentUser stored in local storage
  private getCollectorCity(): string {
    const userData = localStorage.getItem(this.currentUserKey);
    if (userData) {
      try {
        const currentUser: User = JSON.parse(userData);
        return currentUser.address ? currentUser.address.trim() : '';
      } catch (error) {
        console.error('Error parsing currentUser from localStorage', error);
      }
    }
    return '';
  }

  // Return all requests in the collector's city that have a "pending" status
  getRequestsForCurrentUser(): Request[] {
    const collectorCity = this.getCollectorCity().toLowerCase().trim();
    const allRequests = this.getRequests();
    return allRequests.filter(request =>
      request.address &&
      request.address.toLowerCase().includes(collectorCity) &&
      request.status === 'pending'
    );
  }

  // Update the status of a given request in local storage
  updateRequestStatus(requestId: number, newStatus: Request['status']): void {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
      requests[index].status = newStatus;
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
    }
  }

  // Accept a pending request:
  //   - Mark it as "validated" in local storage
  //   - Award points to the request's creator (user) based on its waste items
  acceptRequest(requestId: number): void {
    const requests = this.getRequests();
    const request = requests.find(r => r.id === requestId);
    if (request && request.status === 'pending') {
      request.status = 'validated';
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
      this.awardPoints(request);
    }
  }

  // Reject a pending request: mark its status as "rejected"
  rejectRequest(requestId: number): void {
    const requests = this.getRequests();
    const request = requests.find(r => r.id === requestId);
    if (request && request.status === 'pending') {
      request.status = 'rejected';
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
    }
  }

  // Award points to the user who created the request.
  // The points are calculated by iterating over all waste items in the request.
  private awardPoints(request: Request): void {
    let totalPoints = 0;
    if (request.wasteItems && request.wasteItems.length > 0) {
      for (const item of request.wasteItems) {
        totalPoints += this.calculatePointsForItem(item.type, item.weight);
      }
    } else if ((request as any).type && (request as any).weight) {
      // Fallback in case wasteItems is not present at the root level.
      totalPoints = this.calculatePointsForItem((request as any).type, (request as any).weight);
    }
    this.updateUserScore(request.userId, totalPoints);
  }

  // Calculate points for a single waste item.
  // Weight is in grams; convert to kg and multiply by the corresponding rate.
  private calculatePointsForItem(wasteType: string, weightInGrams: number): number {
    const weightKg = weightInGrams / 1000;
    let pointsPerKg = 0;
    switch (wasteType.toLowerCase().trim()) {
      case 'plastique':
        pointsPerKg = 2;
        break;
      case 'verre':
        pointsPerKg = 1;
        break;
      case 'papier':
        pointsPerKg = 1;
        break;
      case 'métal':
      case 'metal':
        pointsPerKg = 5;
        break;
      default:
        pointsPerKg = 0;
    }
    return Math.round(weightKg * pointsPerKg);
  }

  // Retrieve users from local storage. Users must already exist.
  private getUsers(): User[] {
    const stored = localStorage.getItem(this.usersKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Update the user’s score by adding additionalScore.
  // Also update the currentUser object if it matches the given email.
  private updateUserScore(email: string, additionalScore: number): void {
    const users = this.getUsers();
    const index = users.findIndex(user => user.email === email);
    if (index !== -1) {
      // Initialize the score if it doesn't exist
      if (typeof users[index].score !== 'number') {
        users[index].score = 0;
      }
      users[index].score += additionalScore;
      localStorage.setItem(this.usersKey, JSON.stringify(users));

      // Also update currentUser if applicable
      const currentUserData = localStorage.getItem(this.currentUserKey);
      if (currentUserData) {
        try {
          const currentUser: User = JSON.parse(currentUserData);
          if (currentUser.email === email) {
            currentUser.score = users[index].score;
            localStorage.setItem(this.currentUserKey, JSON.stringify(currentUser));
          }
        } catch (error) {
          console.error('Error parsing currentUser from localStorage', error);
        }
      }
    } else {
      console.warn(`User with email ${email} not found. Score not updated.`);
    }
  }

  // Optional helper to retrieve a user's current score
  getUserScore(email: string): number {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    return user && typeof user.score === 'number' ? user.score : 0;
  }
}
