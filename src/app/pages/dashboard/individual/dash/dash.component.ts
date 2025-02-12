import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Request } from '../../../../core/models/request.model';
import { RequestService } from '../../../../core/services/request.service';
import { AuthService } from '../../../../core/services/auth-service.service';
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
  // Summary fields
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
    wasteItems: [],
    photos: [],
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
      this.myScore = currentUser.score ?? 0;

      this.subscription = this.requestService.requests$.subscribe(requests => {
        this.requests = requests.filter(req => req.userId === this.userId);
        this.totalRequests = this.requests.length;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  getTotalWeight(req: Request): number {
    return req.wasteItems.reduce((sum, item) => sum + item.weight, 0);
  }


  get filteredRequests(): Request[] {
    if (!this.searchText) {
      return this.requests;
    }
    const lowerSearch = this.searchText.toLowerCase();
    return this.requests.filter(req => {
      const wasteTypes = req.wasteItems.map(item => item.type).join(' ');
      const haystack = (wasteTypes + ' ' + req.address).toLowerCase();
      return haystack.includes(lowerSearch);
    });
  }


  openAddModal(): void {
    this.newRequest = {
      wasteItems: [{ type: '', weight: 1000 }],
      photos: [],
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
    if (!this.validateAddForm()) return;

    const request: Request = {
      id: 0,
      userId: this.userId,
      wasteItems: this.newRequest.wasteItems || [],
      photos: this.newRequest.photos || [],
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
        text: 'You have reached the limit (3 pending or total > 10kg).',
        timer: 3000,
        showConfirmButton: false
      });
    }
  }

  removeWasteItem(index: number): void {
    if (this.newRequest.wasteItems) {
      this.newRequest.wasteItems.splice(index, 1);
    }
  }


  openEditModal(req: Request): void {
    this.currentRequest = JSON.parse(JSON.stringify(req));
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


  deleteRequest(req: Request): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
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


  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files) return;

    if (!this.newRequest.photos) {
      this.newRequest.photos = [];
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result as string;
        this.newRequest.photos!.push(base64);
      };
      reader.readAsDataURL(file);
    }
  }


  validateAddForm(): boolean {
    if (!this.newRequest.wasteItems || this.newRequest.wasteItems.length === 0) {
      this.showValidationError('Please add at least one waste item.');
      return false;
    }

    for (const item of this.newRequest.wasteItems) {
      if (!item.type || !item.weight || item.weight < 1000) {
        this.showValidationError('Each waste item must have a type and weight >= 1000g.');
        return false;
      }
    }

    if (!this.newRequest.address || !this.newRequest.date || !this.newRequest.timeSlot) {
      this.showValidationError('Please fill all required fields.');
      return false;
    }
    return true;
  }

  showValidationError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Form',
      text: message,
      timer: 3000,
      showConfirmButton: false
    });
  }
}
