export type UserRole = "customer" | "worker" | "admin";

export interface User {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  address?: string;
}

export interface Worker {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  location: string;
  experienceYears: number;
  verified: boolean;
  avatar: string;
  bio: string;
  skills?: string[];
  phone?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Booking {
  id: string;
  customerId: string;
  workerId: string;
  category: string;
  problemDescription: string;
  scheduledDate: string;
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled";
  agreedPrice: number;
  address: string;
  createdAt: string;
}
