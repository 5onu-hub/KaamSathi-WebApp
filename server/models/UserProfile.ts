import { Schema, model, Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: string;
  email: string;
  fullName: string;
  role: "customer" | "worker" | "admin";
  profilePhoto: string;
  phone: string;
  city: string;
  state: string;
  gender: string;
  dob: string;
  bio: string;
  languages: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  isVerified: boolean;
  memberSince: Date;
  profileCompletion: number;
  
  // Worker extra fields
  skills?: string[];
  experience?: string;
  hourlyRate?: number;
  dailyRate?: number;
  availableCities?: string[];
  portfolio?: string[];
  certificates?: string[];
  availability?: string;

  // Customer extra fields
  defaultLocation?: string;
}

const userProfileSchema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ["customer", "worker", "admin"], default: "customer" },
  profilePhoto: { type: String, default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" },
  phone: { type: String, default: "+91 98765 43210" },
  city: { type: String, default: "New Delhi" },
  state: { type: String, default: "Delhi" },
  gender: { type: String, default: "Prefer not to say" },
  dob: { type: String, default: "1995-06-15" },
  bio: { type: String, default: "Reliable KaamSathi platform member dedicated to quality home services." },
  languages: { type: [String], default: ["English", "Hindi"] },
  emergencyContact: {
    name: { type: String, default: "Ramesh Sharma" },
    phone: { type: String, default: "+91 98111 22334" },
    relation: { type: String, default: "Family" }
  },
  isVerified: { type: Boolean, default: true },
  memberSince: { type: Date, default: Date.now },
  profileCompletion: { type: Number, default: 88 },

  // Worker fields
  skills: { type: [String], default: ["Electrical Repair", "Wiring", "MCB Troubleshooting"] },
  experience: { type: String, default: "5 Years" },
  hourlyRate: { type: Number, default: 450 },
  dailyRate: { type: Number, default: 3200 },
  availableCities: { type: [String], default: ["New Delhi", "Gurugram", "Noida"] },
  portfolio: { type: [String], default: [] },
  certificates: { type: [String], default: ["ITI Electrical Diploma", "Safety Certified"] },
  availability: { type: String, default: "Mon-Sat, 9 AM - 7 PM" },

  // Customer fields
  defaultLocation: { type: String, default: "Connaught Place, New Delhi" }
}, { timestamps: true });

export const UserProfile = model<IUserProfile>("UserProfile", userProfileSchema);

export interface IUserPreferences extends Document {
  userId: string;
  language: string;
  theme: "light" | "dark" | "system";
  timezone: string;
  notifications: {
    bookingUpdates: boolean;
    messages: boolean;
    payments: boolean;
    offers: boolean;
    aiSuggestions: boolean;
    supportTickets: boolean;
  };
  privacy: {
    profileVisibility: string;
    showPhone: boolean;
    showEmail: boolean;
    allowChat: boolean;
    allowCall: boolean;
  };
}

const userPreferencesSchema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  language: { type: String, default: "English" },
  theme: { type: String, enum: ["light", "dark", "system"], default: "dark" },
  timezone: { type: String, default: "IST (UTC+5:30)" },
  notifications: {
    bookingUpdates: { type: Boolean, default: true },
    messages: { type: Boolean, default: true },
    payments: { type: Boolean, default: true },
    offers: { type: Boolean, default: false },
    aiSuggestions: { type: Boolean, default: true },
    supportTickets: { type: Boolean, default: true }
  },
  privacy: {
    profileVisibility: { type: String, default: "Public" },
    showPhone: { type: Boolean, default: false },
    showEmail: { type: Boolean, default: false },
    allowChat: { type: Boolean, default: true },
    allowCall: { type: Boolean, default: true }
  }
}, { timestamps: true });

export const UserPreferences = model<IUserPreferences>("UserPreferences", userPreferencesSchema);

export interface ISavedAddress extends Document {
  userId: string;
  title: string;
  addressLine: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

const savedAddressSchema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true }, // e.g. "Home", "Office"
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

export const SavedAddress = model<ISavedAddress>("SavedAddress", savedAddressSchema);

export interface IActivityLog extends Document {
  userId: string;
  action: string;
  details: string;
  device: string;
  browser: string;
  ipAddress: string;
  createdAt: Date;
}

const activityLogSchema = new Schema({
  userId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  device: { type: String, default: "Macintosh / Windows" },
  browser: { type: String, default: "Chrome 125.0" },
  ipAddress: { type: String, default: "192.168.1.45" },
  createdAt: { type: Date, default: Date.now }
});

export const ActivityLog = model<IActivityLog>("ActivityLog", activityLogSchema);
