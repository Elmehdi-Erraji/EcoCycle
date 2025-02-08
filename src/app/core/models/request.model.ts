// request.model.ts
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
  // Update the allowed statuses:
  status: 'pending' | 'reserved' | 'ongoing' | 'validated' | 'rejected';
  // Optional field to record which collector reserved the request:
  reservedBy?: string;
}
