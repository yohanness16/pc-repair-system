export interface User {
  id: string;
  username: string;
  role: 'admin' | 'it_staff';
  department: string;
  email: string;
}

export interface RepairTicket {
  id: string;
  ticketNumber: string;
  deviceType: 'pc' | 'printer' | 'laptop' | 'monitor';
  deviceId: string;
  location: string;
  department: string;
  issueDescription: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled';
  assignedTo: string;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedCost?: number;
  actualCost?: number;
  notes: string[];
}

export interface WeeklyReport {
  week: string;
  totalTickets: number;
  completedTickets: number;
  pendingTickets: number;
  avgResolutionTime: number;
  costSaved: number;
  deviceBreakdown: {
    pc: number;
    printer: number;
    laptop: number;
    monitor: number;
  };
}

export interface DashboardStats {
  totalDevices: number;
  activeTickets: number;
  completedThisWeek: number;
  avgResolutionTime: number;
  costThisMonth: number;
  efficiency: number;
}
