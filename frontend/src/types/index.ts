// Type definitions mirroring the MongoDB models in server/models

export type UserRole = 'citizen' | 'volunteer' | 'ngo' | 'admin';

export type RequestStatus = 'pending' | 'accepted' | 'in_progress' | 'resolved' | 'cancelled';
export type RequestPriority = 'low' | 'medium' | 'high' | 'critical';
export type RequestType = 'food' | 'water' | 'medicine' | 'sos';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string; // hashed in real backend; plain here for demo
  role: UserRole;
  phone?: string;
  avatar?: string;
  location?: { lat: number; lng: number; address?: string };
  isVerified: boolean;
  emailVerified: boolean;
  createdAt: string;
  // volunteer-specific
  volunteerProfile?: {
    skills: string[];
    availability: boolean;
    rewardPoints: number;
    missionsCompleted: number;
    verified: boolean;
  };
  // ngo-specific
  ngoProfile?: {
    organizationName: string;
    registrationId: string;
    approved: boolean;
    description?: string;
  };
}

export interface BaseRequest {
  _id: string;
  type: RequestType;
  citizen: string; // user id
  citizenName: string;
  status: RequestStatus;
  priority: RequestPriority;
  description: string;
  location: { lat: number; lng: number; address?: string };
  peopleCount: number;
  assignedVolunteer?: string;
  assignedVolunteerName?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export type SOSRequest = BaseRequest;
export type FoodRequest = BaseRequest;
export type MedicineRequest = BaseRequest;

export interface ReliefCamp {
  _id: string;
  name: string;
  ngo: string; // user id
  ngoName: string;
  location: { lat: number; lng: number; address: string };
  capacity: number;
  occupants: number;
  foodStock: number;
  waterStock: number;
  medicineStock: number;
  medicalSupport: boolean;
  status: 'active' | 'full' | 'closed';
  createdAt: string;
}

export interface MissingPerson {
  _id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  lastSeenLocation: { lat: number; lng: number; address: string };
  lastSeenDate: string;
  description: string;
  photo?: string;
  reportedBy: string;
  reportedByName: string;
  status: 'missing' | 'found' | 'safe';
  createdAt: string;
}

export interface Donation {
  _id: string;
  donor: string;
  donorName: string;
  ngo: string;
  ngoName: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string; // user id
  title: string;
  message: string;
  type: 'sos' | 'request' | 'system' | 'mission' | 'donation';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface DisasterAlert {
  _id: string;
  title: string;
  type: 'flood' | 'earthquake' | 'cyclone' | 'fire' | 'landslide' | 'drought' | 'other';
  severity: 'advisory' | 'watch' | 'warning' | 'critical';
  location: { lat: number; lng: number; address: string };
  description: string;
  affectedAreas: string[];
  active: boolean;
  createdAt: string;
}

export interface Message {
  _id: string;
  sender: string;
  senderName: string;
  recipient: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Volunteer {
  _id: string;
  user: string; // user id
  name: string;
  skills: string[];
  availability: boolean;
  location: { lat: number; lng: number };
  rewardPoints: number;
  missionsCompleted: number;
  verified: boolean;
  rating: number;
}
