export interface Request {
  id: number;
  userId: string;
  type: string;
  photos?: string[];
  weight: number;
  address: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'validated' | 'rejected';
}
