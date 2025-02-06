import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service.service';
import { User } from '../../../core/models/user.model';

// Custom validator to ensure the user is at least a minimum age (18 in this case)
function minimumAgeValidator(minAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // Let required validator handle empty value
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= minAge ? null : { ageInvalid: true };
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMsg: string = '';
  selectedFileName: string = ''; // To display the chosen file name

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, minimumAgeValidator(18)]],
      profilePicture: [''] // Will hold the Base64 string
    });
  }

  // Called when the user selects a file via input or drag & drop.
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name; // Save the file name to display it
      const reader = new FileReader();
      reader.onload = () => {
        // Set the Base64 string as the profilePicture value in the form
        this.registerForm.patchValue({
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle drag over event.
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Optionally, add a visual cue to indicate an active drop zone.
  }

  // Handle drag leave event.
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Optionally, remove the visual cue.
  }

  // Handle drop event.
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      // Process the first file dropped.
      this.onFileSelected({ target: { files: event.dataTransfer.files } });
      event.dataTransfer.clearData();
    }
  }

  onSubmit(): void {
    // Mark all controls as touched so that validation messages display if the form is invalid
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      const newUser: User = this.registerForm.value;
      // Set default role and score for a "particulier"
      newUser.role = 'particulier';
      newUser.score = 0;
      if (this.authService.register(newUser)) {
        // Navigate to login on successful registration
        this.router.navigate(['/login']);
      } else {
        this.errorMsg = 'A user with this email already exists.';
      }
    }
  }
}
