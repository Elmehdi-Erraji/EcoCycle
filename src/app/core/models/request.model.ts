export interface WasteItem {
  type: string;
  weight: number;
}

export interface Request {
  id: number;
  userId: string;
  wasteItems: WasteItem[];
  photos?: string[];
  address: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'validated' | 'rejected';
}
