import { Injectable } from '@angular/core';
import { Request, WasteItem } from '../models/request.model';

// A simple User interface. Users must already exist in local storage under the key "users".
// Do not create a user if it doesn’t exist.
export interface User {
  email: string;
  points: number;
}

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

  // Get collector's city from currentUser stored in local storage
  private getCollectorCity(): string {
    const userData = localStorage.getItem(this.currentUserKey);
    if (userData) {
      try {
        const currentUser = JSON.parse(userData);
        return currentUser.address ? currentUser.address.trim() : '';
      } catch (error) {
        console.error('Error parsing currentUser from localStorage', error);
      }
    }
    return '';
  }

  // Return all requests that are in the collector's city and with a pending status
  getRequestsForCurrentUser(): Request[] {
    const collectorCity = this.getCollectorCity().toLowerCase().trim();
    const allRequests = this.getRequests();
    return allRequests.filter(request =>
      request.address &&
      request.address.toLowerCase().includes(collectorCity) &&
      request.status === 'pending'
    );
  }

  // Update the status of a request in local storage
  updateRequestStatus(requestId: number, newStatus: Request['status']): void {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
      requests[index].status = newStatus;
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
    }
  }

  // Accept a pending request: mark it as validated and award points to the request creator.
  acceptRequest(requestId: number): void {
    const requests = this.getRequests();
    const request = requests.find(r => r.id === requestId);
    if (request && request.status === 'pending') {
      request.status = 'validated';
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
      this.awardPoints(request);
    }
  }

  // Reject a pending request: mark it as rejected.
  rejectRequest(requestId: number): void {
    const requests = this.getRequests();
    const request = requests.find(r => r.id === requestId);
    if (request && request.status === 'pending') {
      request.status = 'rejected';
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
    }
  }

  // Award points based on the waste items in the request. Points are added to the user
  // identified by request.userId (which should match the email). If the user is not found,
  // no points are awarded.
  private awardPoints(request: Request): void {
    let totalPoints = 0;

    if (request.wasteItems && request.wasteItems.length > 0) {
      for (const item of request.wasteItems) {
        totalPoints += this.calculatePointsForItem(item.type, item.weight);
      }
    } else if ((request as any).type && (request as any).weight) {
      // Fallback if wasteItems is not defined
      totalPoints = this.calculatePointsForItem((request as any).type, (request as any).weight);
    }

    this.updateUserPoints(request.userId, totalPoints);
  }

  // Calculate points for a single waste item. Weight is assumed in grams.
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
        break;
    }
    return Math.round(weightKg * pointsPerKg);
  }

  // Retrieve users from local storage (users must already exist)
  private getUsers(): User[] {
    const stored = localStorage.getItem(this.usersKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Update the user’s points by adding additionalPoints. Do nothing if the user is not found.
  private updateUserPoints(email: string, additionalPoints: number): void {
    const users = this.getUsers();
    const index = users.findIndex(user => user.email === email);
    if (index !== -1) {
      users[index].points += additionalPoints;
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    } else {
      console.warn(`User with email ${email} not found. Points not awarded.`);
    }
  }
}
