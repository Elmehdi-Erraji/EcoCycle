// dash1.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Request } from '../../../../core/models/request.model';
import { CollectService } from '../../../../core/services/collect.service';

@Component({
  selector: 'app-dash-component1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash1.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent1 implements OnInit {
  requests: Request[] = [];
  selectedRequest: Request | null = null;

  constructor(private collectService: CollectService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requests = this.collectService.getRequestsForCurrentUser();
    console.log('Loaded requests:', this.requests);
  }

  openRequestModal(request: Request): void {
    this.selectedRequest = request;
  }

  closeRequestModal(): void {
    this.selectedRequest = null;
  }

  getRequestType(request: Request): string {
    if (request.wasteItems && request.wasteItems.length > 0) {
      return request.wasteItems[0].type;
    } else if ((request as any).type) {
      return (request as any).type;
    }
    return 'Unknown';
  }

  getRequestWeight(request: Request): number {
    if (request.wasteItems && request.wasteItems.length > 0) {
      return request.wasteItems.reduce((sum, item) => sum + item.weight, 0);
    } else if ((request as any).weight) {
      return (request as any).weight;
    }
    return 0;
  }

  reserveRequest(request: Request): void {
    this.collectService.reserveRequest(request.id);
    Swal.fire({
      icon: 'success',
      title: 'Request Reserved',
      text: 'The request has been reserved. Proceed to collect when ready.',
      timer: 2000,
      showConfirmButton: false
    });
    this.loadRequests();
    this.closeRequestModal();
  }

  startCollection(request: Request): void {
    this.collectService.startCollection(request.id);
    Swal.fire({
      icon: 'success',
      title: 'Collection Started',
      text: 'You have started the collection.',
      timer: 2000,
      showConfirmButton: false
    });
    this.loadRequests();
    this.closeRequestModal();
  }

  completeCollection(request: Request): void {
    this.collectService.completeCollection(request.id);
    Swal.fire({
      icon: 'success',
      title: 'Collection Completed',
      text: 'The collection is complete and the user has been awarded points.',
      timer: 2000,
      showConfirmButton: false
    });
    this.loadRequests();
    this.closeRequestModal();
  }

  rejectRequest(request: Request): void {
    this.collectService.rejectRequest(request.id);
    Swal.fire({
      icon: 'error',
      title: 'Request Rejected',
      text: 'The request has been rejected.',
      timer: 2000,
      showConfirmButton: false
    });
    this.loadRequests();
    this.closeRequestModal();
  }
}
