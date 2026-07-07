import { LucideIcon } from "lucide-react";
import { ComponentType } from "react";
export type { ILogin } from "./auth.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number,
    page: number,
    totalPages: number,
    limit: number
  }
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
    icon: LucideIcon;
  }[];
}

export type TRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

type ZodIssue = {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
};

type ErrorSource = {
  path: string;
  message: string;
};

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSources?: ErrorSource[];
  err?: {
    issues: ZodIssue[];
    name: string;
  };
  stack?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  auths: {
    provider: string;
    providerId: string;
  }[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface IAuth {
  provider: string;
  providerId: string;
}

