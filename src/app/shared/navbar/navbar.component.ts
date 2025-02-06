import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth-service.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isSidebarOpen = true;
  isMobile = false;
  isDropdownOpen = false;
  isMessagesDropdownOpen = false;
  isNotificationsDropdownOpen = false;

  dropdowns: { [key: string]: boolean } = {
    members: false,
    species: false,
    competitions: false,
    participations: false,
    hunts: false,
    huntsMember: false,
    results: false,
    competitionsMember: false,
    collection: false,     // Added for "Collection"
    centers: false,        // Added for "Centers"
    events: false,         // Added for "Events"
    volunteering: false,   // Added for "Volunteering"
    reports: false         // Added for "Reports"
  };

  // Property to hold the current user
  user: User | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.checkScreenSize();

    // Retrieve the user from local storage.
    // Ensure that you store the user with the same key "currentUser"
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        console.log('Retrieved user from localStorage:', this.user);
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        this.user = null;
      }
    } else {
      this.user = null;
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event) {
    const target = event.target as HTMLElement;

    // Close sidebar in mobile mode if clicked outside
    if (this.isMobile && this.isSidebarOpen && !target.closest('.fixed') && !target.closest('.toggle-button')) {
      this.isSidebarOpen = false;
    }

    // Close all dropdowns if clicked outside a relative container
    if (!target.closest('.relative')) {
      this.isDropdownOpen = false;
      this.isMessagesDropdownOpen = false;
      this.isNotificationsDropdownOpen = false;
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    this.isSidebarOpen = !this.isMobile;
  }

  // Toggle sidebar visibility
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Toggle profile dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isMessagesDropdownOpen = false;
    this.isNotificationsDropdownOpen = false;
  }

  // Toggle messages dropdown
  toggleMessagesDropdown() {
    this.isMessagesDropdownOpen = !this.isMessagesDropdownOpen;
    this.isNotificationsDropdownOpen = false;
    this.isDropdownOpen = false;
  }

  // Toggle notifications dropdown
  toggleNotificationsDropdown() {
    this.isNotificationsDropdownOpen = !this.isNotificationsDropdownOpen;
    this.isMessagesDropdownOpen = false;
    this.isDropdownOpen = false;
  }

  // Toggle a specific sidebar dropdown
  toggleSidebarDropdown(section: string) {
    // Close other dropdowns
    for (const key in this.dropdowns) {
      if (key !== section) {
        this.dropdowns[key] = false;
      }
    }
    // Toggle the selected dropdown
    this.dropdowns[section] = !this.dropdowns[section];
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    // Remove the user from local storage using the correct key
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
