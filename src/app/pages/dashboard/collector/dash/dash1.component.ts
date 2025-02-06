import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Request } from '../../../../core/models/request.model';

@Component({
  selector: 'app-dash-component1',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './dash1.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent1 implements OnInit {
  requests: Request[] = [];
  selectedRequest: Request | null = null;

  ngOnInit(): void {
    // Dummy data for now
    this.requests = [
      {
        id: 1,
        userId: 'user123',
        wasteItems: [{ type: 'Plastique', weight: 2000 }],
        address: '123 Green Street',
        date: '12/03/2025',
        timeSlot: '14:00-16:00',
        status: 'pending',
        photos: [
          'https://via.placeholder.com/150',
          'https://via.placeholder.com/150'
        ]
      },
      {
        id: 2,
        userId: 'user456',
        wasteItems: [{ type: 'Verre', weight: 3500 }],
        address: '456 Recycle Avenue',
        date: '13/03/2025',
        timeSlot: '10:00-12:00',
        status: 'pending',
        photos: []
      }
    ];
  }

  openRequestModal(request: Request): void {
    this.selectedRequest = request;
  }

  closeRequestModal(): void {
    this.selectedRequest = null;
  }
}
