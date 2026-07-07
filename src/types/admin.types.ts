// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";
export type UserStatus = "active" | "suspended" | "deleted";

export interface AuthProvider {
  provider: string;
  providerId: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  currency: string;
  timezone: string;
  isVerified: boolean;
  auths: AuthProvider[];
  createdAt: string;
  updatedAt: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface UsersFiltersState {
  searchTerm: string;
  role: UserRole | "";
  status: UserStatus | "";
}