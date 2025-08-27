import React, { createContext, useContext, useState } from 'react';
import { RepairTicket, WeeklyReport, DashboardStats } from '../types';

interface DataContextType {
  tickets: RepairTicket[];
  addTicket: (ticket: Omit<RepairTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<RepairTicket>) => void;
  deleteTicket: (id: string) => void;
  getWeeklyReports: () => WeeklyReport[];
  getDashboardStats: () => DashboardStats;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockTickets: RepairTicket[] = [
  {
    id: '1',
    ticketNumber: 'IT-2024-001',
    deviceType: 'pc',
    deviceId: 'PC-BRANCH-001',
    location: 'Main Branch - Teller Station 1',
    department: 'Customer Service',
    issueDescription: 'Computer won\'t boot up, blue screen error on startup',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'tech1',
    reportedBy: 'Sarah Johnson',
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T14:22:00Z',
    estimatedCost: 150,
    notes: [
      'Initial diagnosis: Hardware failure suspected',
      'RAM modules tested - all working',
      'Hard drive diagnostics in progress'
    ]
  },
  {
    id: '2',
    ticketNumber: 'IT-2024-002',
    deviceType: 'printer',
    deviceId: 'PR-ADMIN-002',
    location: 'Administrative Floor - Office 204',
    department: 'Administration',
    issueDescription: 'Printer jamming frequently, print quality poor',
    priority: 'medium',
    status: 'waiting_parts',
    assignedTo: 'tech2',
    reportedBy: 'Michael Chen',
    createdAt: '2024-01-14T11:15:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    estimatedCost: 75,
    actualCost: 45,
    notes: [
      'Cleaned roller mechanism',
      'Ordered replacement toner cartridge',
      'Waiting for delivery'
    ]
  },
  {
    id: '3',
    ticketNumber: 'IT-2024-003',
    deviceType: 'laptop',
    deviceId: 'LT-LOAN-015',
    location: 'Loan Department - Manager Office',
    department: 'Loans',
    issueDescription: 'Laptop overheating and shutting down randomly',
    priority: 'critical',
    status: 'completed',
    assignedTo: 'tech1',
    reportedBy: 'Lisa Rodriguez',
    createdAt: '2024-01-13T13:22:00Z',
    updatedAt: '2024-01-14T10:30:00Z',
    completedAt: '2024-01-14T10:30:00Z',
    estimatedCost: 200,
    actualCost: 120,
    notes: [
      'Thermal paste replacement required',
      'Fan cleaning completed',
      'System stress test passed',
      'Device returned to user'
    ]
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<RepairTicket[]>(mockTickets);

  const addTicket = (newTicket: Omit<RepairTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => {
    const ticket: RepairTicket = {
      ...newTicket,
      id: Date.now().toString(),
      ticketNumber: `IT-2024-${String(tickets.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: newTicket.notes || []
    };
    setTickets(prev => [ticket, ...prev]);
  };

  const updateTicket = (id: string, updates: Partial<RepairTicket>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id 
        ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
        : ticket
    ));
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const getWeeklyReports = (): WeeklyReport[] => {
    // Mock weekly reports
    return [
      {
        week: 'Jan 8-14, 2024',
        totalTickets: 12,
        completedTickets: 8,
        pendingTickets: 4,
        avgResolutionTime: 2.3,
        costSaved: 1500,
        deviceBreakdown: { pc: 5, printer: 3, laptop: 3, monitor: 1 }
      },
      {
        week: 'Jan 1-7, 2024',
        totalTickets: 8,
        completedTickets: 7,
        pendingTickets: 1,
        avgResolutionTime: 1.8,
        costSaved: 1200,
        deviceBreakdown: { pc: 3, printer: 2, laptop: 2, monitor: 1 }
      }
    ];
  };

  const getDashboardStats = (): DashboardStats => {
    const completedThisWeek = tickets.filter(t => 
      t.status === 'completed' && 
      new Date(t.completedAt || '').getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;

    const activeTickets = tickets.filter(t => 
      ['pending', 'in_progress', 'waiting_parts'].includes(t.status)
    ).length;

    return {
      totalDevices: 156,
      activeTickets,
      completedThisWeek,
      avgResolutionTime: 2.1,
      costThisMonth: 2850,
      efficiency: 87
    };
  };

  return (
    <DataContext.Provider value={{
      tickets,
      addTicket,
      updateTicket,
      deleteTicket,
      getWeeklyReports,
      getDashboardStats
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};