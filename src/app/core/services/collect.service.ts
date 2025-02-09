// collect.service.ts
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

  // Helper: Get the current logged-in user (collector)
  private getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.currentUserKey);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing currentUser from localStorage', error);
      }
    }
    return null;
  }

  // Get collector's city from the currentUser stored in local storage
  private getCollectorCity(): string {
    const currentUser = this.getCurrentUser();
    return currentUser && currentUser.address ? currentUser.address.trim() : '';
  }

  // Return all requests available to the collector.
  // Available means pending OR reserved/ongoing (reserved by the current collector)
  getRequestsForCurrentUser(): Request[] {
    const collectorCity = this.getCollectorCity().toLowerCase().trim();
    const allRequests = this.getRequests();
    const currentUser = this.getCurrentUser();
    return allRequests.filter(request => {
      if (!request.address || !request.address.toLowerCase().includes(collectorCity)) {
        return false;
      }
      if (request.status === 'pending') {
        return true;
      }
      if ((request.status === 'reserved' || request.status === 'ongoing') && currentUser) {
        return request.reservedBy === currentUser.email;
      }
      return false;
    });
  }

  // Reserve a pending request.
  reserveRequest(requestId: number): void {
    const requests = this.getRequests();
    const request = requests.find(r => r.id === requestId);
    const currentUser = this.getCurrentUser();
    if (request && request.status === 'pending' && currentUser) {
      request.status = 'reserved';
      request.reservedBy = currentUser.email;
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
    }
  }

  // Mark the request as ongoing (if used).
  startCollection(requestId: number): void {
    const requests = this.getRequests();
    const request = requests.find(r => r.id === requestId);
    const currentUser = this.getCurrentUser();
    if (request && request.status === 'reserved' && request.reservedBy === currentUser?.email) {
      request.status = 'ongoing';
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
    }
  }

  // Validate the request: change its status to 'validated' and award points to the request creator.
  completeCollection(requestId: number): void {
    const requests = this.getRequests();
    const request = requests.find(r => r.id === requestId);
    const currentUser = this.getCurrentUser();
    // Accept requests that are reserved (or ongoing if needed)
    if (
      request &&
      (request.status === 'reserved' || request.status === 'ongoing') &&
      request.reservedBy === currentUser?.email
    ) {
      request.status = 'validated';
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
      this.awardPoints(request);
    }
  }

  // Reject a request.
  rejectRequest(requestId: number): void {
    const requests = this.getRequests();
    const request = requests.find(r => r.id === requestId);
    const currentUser = this.getCurrentUser();
    if (request) {
      if (
        request.status === 'pending' ||
        ((request.status === 'reserved' || request.status === 'ongoing') &&
          request.reservedBy === currentUser?.email)
      ) {
        request.status = 'rejected';
        localStorage.setItem(this.requestsKey, JSON.stringify(requests));
      }
    }
  }

  // Award points to the user who created the request.
  private awardPoints(request: Request): void {
    let totalPoints = 0;
    if (request.wasteItems && request.wasteItems.length > 0) {
      for (const item of request.wasteItems) {
        totalPoints += this.calculatePointsForItem(item.type, item.weight);
      }
    } else if ((request as any).type && (request as any).weight) {
      totalPoints = this.calculatePointsForItem((request as any).type, (request as any).weight);
    }
    // Award points to the creator (whose email is in request.userId)
    this.updateUserScore(request.userId, totalPoints);
  }

  // Calculate points for a single waste item.
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

  // Retrieve users from local storage.
  private getUsers(): User[] {
    const stored = localStorage.getItem(this.usersKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Update the user's score by adding additionalScore.
  private updateUserScore(email: string, additionalScore: number): void {
    const users = this.getUsers();
    const index = users.findIndex(user => user.email === email);
    if (index !== -1) {
      if (typeof users[index].score !== 'number') {
        users[index].score = 0;
      }
      users[index].score += additionalScore;
      localStorage.setItem(this.usersKey, JSON.stringify(users));

      // If the user being updated is also the current user, update currentUser data.
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

  // Optional helper to retrieve a user's current score.
  getUserScore(email: string): number {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    return user && typeof user.score === 'number' ? user.score : 0;
  }

  // Returns requests that are either reserved or validated for the current collector.
  getMyReservedRequests(): Request[] {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      console.log('No current user found.');
      return [];
    }
    const allRequests = this.getRequests();
    const myReserved = allRequests.filter(request =>
      ((request.status === 'reserved' || request.status === 'validated') &&
        request.reservedBy?.trim().toLowerCase() === currentUser.email.trim().toLowerCase())
    );
    console.log('My reserved requests:', myReserved);
    return myReserved;
  }
}
