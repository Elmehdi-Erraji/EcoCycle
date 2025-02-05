
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

interface Request {
  id: number;
  type: string;
  photos?: string;
  weight: number; // in grams
  address: string;
  date: string; // e.g., 2025-03-15
  timeSlot: string; // e.g., "09:00-12:00"
  notes?: string;
  status: string; // "En attente", etc.
}

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent {
  // Dummy summary values
  totalRequests = 5;
  myScore = 82;

  // Dummy request data
  requests: Request[] = [
    {
      id: 1,
      type: 'Plastique, Papier',
      weight: 1500,
      address: '123 Rue de la Recyclage, Paris',
      date: '2025-03-15',
      timeSlot: '09:00-12:00',
      notes: 'Please pick up carefully',
      status: 'En attente'
    },
    {
      id: 2,
      type: 'Verre',
      weight: 2000,
      address: '456 Avenue Verte, Lyon',
      date: '2025-03-16',
      timeSlot: '14:00-17:00',
      notes: '',
      status: 'En attente'
    },
    {
      id: 3,
      type: 'Métal',
      weight: 1200,
      address: '789 Boulevard Écolo, Marseille',
      date: '2025-03-17',
      timeSlot: '10:00-13:00',
      notes: 'Call before arrival',
      status: 'En attente'
    }
  ];

  // For filtering & search
  searchText: string = '';
  filterDate: string = '';

  // Modal control booleans
  isAddModalOpen = false;
  isEditModalOpen = false;
  isShowModalOpen = false;
  currentRequest: Request | null = null;

  // Open the Add Request modal
  openAddModal() {
    this.isAddModalOpen = true;
  }
  closeAddModal() {
    this.isAddModalOpen = false;
  }

  // Open the Edit modal (dummy)
  openEditModal(req: Request) {
    this.currentRequest = req;
    this.isEditModalOpen = true;
  }
  closeEditModal() {
    this.isEditModalOpen = false;
    this.currentRequest = null;
  }

  // Open the Show Details modal (dummy)
  openShowModal(req: Request) {
    this.currentRequest = req;
    this.isShowModalOpen = true;
  }
  closeShowModal() {
    this.isShowModalOpen = false;
    this.currentRequest = null;
  }

  // Dummy methods for Delete (just removes from the array)
  deleteRequest(req: Request) {
    this.requests = this.requests.filter(r => r.id !== req.id);
    // Optionally update totalRequests
    this.totalRequests = this.requests.length;
  }

  // Filtered requests based on search text and date (simple filter)
  get filteredRequests() {
    return this.requests.filter(req => {
      const matchesSearch = req.type.toLowerCase().includes(this.searchText.toLowerCase()) ||
        req.address.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDate = this.filterDate ? req.date === this.filterDate : true;
      return matchesSearch && matchesDate;
    });
  }
}
