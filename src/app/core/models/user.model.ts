export interface User {
  id?: string;                    // Optional
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  dateOfBirth: string;            // In ISO format (YYYY-MM-DD)
  profilePicture?: string;        // optional
  role: 'particulier' | 'collector';
  score?: number;                 // optional
}
