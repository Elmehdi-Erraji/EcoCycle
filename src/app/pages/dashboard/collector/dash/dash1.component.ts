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

  // Load requests for the current user (collector) from the same city with pending status
  loadRequests(): void {
    this.requests = this.collectService.getRequestsForCurrentUser();
    console.log('Loaded requests:', this.requests);
  }

  // Open the modal and set the selected request
  openRequestModal(request: Request): void {
    this.selectedRequest = request;
  }

  // Close the modal
  closeRequestModal(): void {
    this.selectedRequest = null;
  }

  // Helper: Get the type of the request. If wasteItems exist, show the first type.
  // In the modal, we will list each waste item separately.
  getRequestType(request: Request): string {
    if (request.wasteItems && request.wasteItems.length > 0) {
      return request.wasteItems[0].type;
    } else if ((request as any).type) { // fallback if properties are at root level
      return (request as any).type;
    }
    return 'Unknown';
  }

  // Helper: Get the total weight of the request. If multiple waste items exist, return the sum.
  getRequestWeight(request: Request): number {
    if (request.wasteItems && request.wasteItems.length > 0) {
      return request.wasteItems.reduce((sum, item) => sum + item.weight, 0);
    } else if ((request as any).weight) {
      return (request as any).weight;
    }
    return 0;
  }

  // Accept the selected request
  acceptRequest(request: Request): void {
    // Call the service method to accept the request
    this.collectService.acceptRequest(request.id);
    // Show success alert with a message to check collections
    Swal.fire({
      icon: 'success',
      title: 'Request Accepted',
      text: 'Check your collections.',
      timer: 2000,
      showConfirmButton: false
    });
    // Refresh list and close modal
    this.loadRequests();
    this.closeRequestModal();
  }

  // Reject the selected request
  rejectRequest(request: Request): void {
    // Call the service method to reject the request
    this.collectService.rejectRequest(request.id);
    // Show rejection alert
    Swal.fire({
      icon: 'error',
      title: 'Request Rejected',
      text: 'The request has been rejected.',
      timer: 2000,
      showConfirmButton: false
    });
    // Refresh list and close modal
    this.loadRequests();
    this.closeRequestModal();
  }
}
