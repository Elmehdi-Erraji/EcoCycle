import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../../../core/services/request.service';
import { AuthService } from '../../../../core/services/auth-service.service';
import { Request } from '../../../../core/models/request.model';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  totalRequests = 0;
  myScore = 0;
  userId: string = '';

  // Requests
  requests: Request[] = [];
  searchText = '';
  isAddModalOpen = false;
  isEditModalOpen = false;
  isShowModalOpen = false;
  currentRequest: Request | null = null;

  // Available waste types
  wasteTypes: string[] = ['plastique', 'verre', 'papier', 'métal'];

  newRequest: Partial<Request> = {
    type: '',
    weight: 1000,
    address: '',
    date: '',
    timeSlot: '',
    notes: ''
  };

  formErrors = {
    type: false,
    weight: false,
    address: false,
    date: false,
    timeSlot: false
  };

  constructor(
    private requestService: RequestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.email; // Using email as a unique ID
      this.loadRequests();
      this.calculateScore();
    }
  }

  loadRequests(): void {
    this.requests = this.requestService.getRequestsByUser(this.userId);
    this.totalRequests = this.requests.length;
  }

  calculateScore(): void {
    this.myScore = this.requests.filter(req => req.status === 'validated').length * 10;
  }

  openAddModal(): void {
    this.newRequest = {
      type: '',
      weight: 1000,
      address: '',
      date: '',
      timeSlot: '',
      notes: ''
    };
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  validateForm(): boolean {
    this.formErrors = {
      type: !this.newRequest.type,
      weight: this.newRequest.weight! < 1000,
      address: !this.newRequest.address,
      date: !this.newRequest.date,
      timeSlot: !this.newRequest.timeSlot || !/^(0[9-9]|1[0-8]):[0-5][0-9]-(0[9-9]|1[0-8]):[0-5][0-9]$/.test(this.newRequest.timeSlot)
    };

    return !Object.values(this.formErrors).some(error => error);
  }

  addRequest(): void {
    if (!this.validateForm()) return;

    const request: Request = {
      id: this.generateRequestId(),
      userId: this.userId,
      type: this.newRequest.type!,
      weight: this.newRequest.weight!,
      address: this.newRequest.address!,
      date: this.newRequest.date!,
      timeSlot: this.newRequest.timeSlot!,
      notes: this.newRequest.notes || '',
      status: 'pending'
    };

    const success = this.requestService.addRequest(request);
    if (success) {
      this.loadRequests();
      this.calculateScore();
      this.closeAddModal();
    } else {
      alert('You have reached the request limit (3 pending requests or max 10kg total).');
    }
  }

  generateRequestId(): number {
    return this.requests.length > 0 ? Math.max(...this.requests.map(req => req.id)) + 1 : 1;
  }

  deleteRequest(req: Request): void {
    const success = this.requestService.deleteRequest(req.id, this.userId);
    if (success) {
      this.loadRequests();
      this.calculateScore();
    } else {
      alert('Cannot delete this request.');
    }
  }

  openEditModal(req: Request): void {
    this.currentRequest = { ...req };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  updateRequest(): void {
    if (!this.currentRequest) return;

    const success = this.requestService.updateRequest(this.currentRequest);
    if (success) {
      this.loadRequests();
      this.isEditModalOpen = false;
    } else {
      alert('Cannot update this request.');
    }
  }

  openShowModal(req: Request): void {
    this.currentRequest = req;
    this.isShowModalOpen = true;
  }

  closeShowModal(): void {
    this.isShowModalOpen = false;
  }

  get filteredRequests(): Request[] {
    return this.requests.filter(req =>
      req.type.toLowerCase().includes(this.searchText.toLowerCase()) ||
      req.address.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
