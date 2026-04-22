export type UserRole = 'ADMIN' | 'OPERATOR' | 'CLIENT';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE';

export interface SolarUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  companyName: string;
  plantAccess: string[]; // List of Plant IDs this user can access
  createdAt: string;
  lastLogin?: string;
  avatarUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}
