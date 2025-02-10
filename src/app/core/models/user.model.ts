export interface User {
  id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  dateOfBirth: string;
  profilePicture?: string;
  role: 'particulier' | 'collector';
  score?: number;
}
