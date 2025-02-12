// collects.component.ts
import { Component, OnInit } from '@angular/core';
import { Request } from '../../../../core/models/request.model';
import { CollectService } from '../../../../core/services/collect.service';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase, TitleCasePipe} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collects',
  templateUrl: './collects.component.html',
  imports: [
    TitleCasePipe,
    NgIf,
    NgForOf,
    NgSwitch,
    NgSwitchCase
  ],
  styleUrls: ['./collects.component.css']
})
export class CollectsComponent implements OnInit {
  reservedRequests: Request[] = [];
  selectedRequest: Request | null = null;

  constructor(private collectService: CollectService) {}

  ngOnInit(): void {
    this.loadMyReservedRequests();
  }

  loadMyReservedRequests(): void {
    this.reservedRequests = this.collectService.getMyReservedRequests();
  }

  getRequestType(request: Request): string {
    return request.wasteItems && request.wasteItems.length > 0
      ? request.wasteItems[0].type
      : 'Unknown';
  }

  getRequestWeight(request: Request): number {
    return request.wasteItems && request.wasteItems.length > 0
      ? request.wasteItems.reduce((sum, item) => sum + item.weight, 0)
      : 0;
  }

  openRequestModal(request: Request): void {
    this.selectedRequest = request;
  }

  closeRequestModal(): void {
    this.selectedRequest = null;
  }

  completeCollection(request: Request): void {
    this.collectService.completeCollection(request.id);
    Swal.fire({
      icon: 'success',
      title: 'Request Validated',
      text: 'The collection is complete and points have been awarded.',
      timer: 2000,
      showConfirmButton: false
    });
    this.loadMyReservedRequests();
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
    this.loadMyReservedRequests();
    this.closeRequestModal();
  }
}
