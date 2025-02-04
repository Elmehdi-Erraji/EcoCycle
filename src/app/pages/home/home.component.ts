
import { Component, HostListener, ElementRef } from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    NgIf,

    NgClass,
    NgForOf
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isMobileMenuOpen = false;
  isLoginModalOpen = false;

  features = [
    {
      iconClass: 'fa-user-plus',
      title: 'Sign Up',
      description: 'Create your account and join our recycling community.'
    },
    {
      iconClass: 'fa-calendar-alt',
      title: 'Request Collection',
      description: 'Schedule a pickup for your recyclable materials.'
    },
    {
      iconClass: 'fa-recycle',
      title: 'Collector Process',
      description: 'Our registered collectors handle your recycling efficiently.'
    },
    {
      iconClass: 'fa-gift',
      title: 'Earn Rewards',
      description: 'Get incentives for your contribution to sustainability.'
    },
    {
      iconClass: 'fa-chart-line',
      title: 'Track Progress',
      description: 'Monitor your recycling impact and environmental contributions.'
    },
    {
      iconClass: 'fa-users',
      title: 'Community Engagement',
      description: 'Connect with like-minded individuals and share eco-friendly tips.'
    }
  ];

  // Toggle the mobile menu
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Open the login modal
  openLoginModal() {
    this.isLoginModalOpen = true;
  }

  // Close the login modal
  closeLoginModal() {
    this.isLoginModalOpen = false;
  }
}
