import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../../../core/services/request.service';
import { AuthService } from '../../../../core/services/auth-service.service';
import { Request } from '../../../../core/models/request.model';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit, OnDestroy {
  totalRequests = 0;
  myScore = 0;
  userId: string = '';
  requests: Request[] = [];
  searchText = '';
  isAddModalOpen = false;
  isEditModalOpen = false;
  isShowModalOpen = false;
  currentRequest: Request | null = null;
  private subscription!: Subscription;

  newRequest: Partial<Request> = {
    type: '',
    weight: 1000,
    address: '',
    date: '',
    timeSlot: '',
    notes: ''
  };

  constructor(
    private requestService: RequestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.email;
      this.subscription = this.requestService.requests$.subscribe(requests => {
        this.requests = requests.filter(req => req.userId === this.userId);
        this.totalRequests = this.requests.length;
        this.calculateScore();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

  addRequest(): void {
    if (!this.validateForm()) return;

    const request: Request = {
      id: 0,
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
      this.closeAddModal();
      Swal.fire({
        icon: 'success',
        title: 'Request Added',
        text: 'Your recycling request has been successfully added!',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Limit Exceeded',
        text: 'You have reached the request limit (3 pending requests or max 10kg total).',
        timer: 3000,
        showConfirmButton: false
      });
    }
  }

  deleteRequest(req: Request): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.requestService.deleteRequest(req.id, this.userId);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your request has been deleted.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
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
      this.isEditModalOpen = false;
      Swal.fire({
        icon: 'success',
        title: 'Updated Successfully',
        text: 'Your request has been updated successfully!',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Error updating your request. Please try again.',
        timer: 3000,
        showConfirmButton: false
      });
    }
  }

  openShowModal(req: Request): void {
    this.currentRequest = req;
    this.isShowModalOpen = true;
  }

  closeShowModal(): void {
    this.isShowModalOpen = false;
  }

  validateForm(): boolean {
    if (
      !this.newRequest.type ||
      this.newRequest.weight! < 1000 ||
      !this.newRequest.address ||
      !this.newRequest.date ||
      !this.newRequest.timeSlot
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill all required fields with valid data.',
        timer: 3000,
        showConfirmButton: false
      });
      return false;
    }
    return true;
  }

  get filteredRequests(): Request[] {
    return this.requests.filter(req =>
      req.type.toLowerCase().includes(this.searchText.toLowerCase()) ||
      req.address.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
