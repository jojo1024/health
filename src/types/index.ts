export enum DoctorSpecialty {
  GENERAL = "Généraliste",
  SPECIALIST = "Spécialiste"
}

export enum SpecialistType {
  CARDIOLOGY = "Cardiologie",
  DERMATOLOGY = "Dermatologie",
  NEUROLOGY = "Neurologie",
  ORTHOPEDICS = "Orthopédie",
  OPHTHALMOLOGY = "Ophtalmologie",
  GYNECOLOGY = "Gynécologie",
  PEDIATRICS = "Pédiatrie",
  PSYCHIATRY = "Psychiatrie",
  OTHER = "Autre"
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export interface Patient extends Person {
  socialSecurityNumber: string;
  primaryDoctorId: string | null; // null if not assigned
}

export interface Doctor extends Person {
  licenseNumber: string;
  specialty: DoctorSpecialty;
  specialistType?: SpecialistType; // only if specialty is SPECIALIST
  isAlsoPatient: boolean; // true if doctor is also a patient
  patientId?: string; // only if isAlsoPatient is true
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  notes: string;
  prescriptions: string[];
  specialistReferrals: SpecialistReferral[];
  reimbursementStatus: ReimbursementStatus;
  reimbursementAmount: number | null;
  reimbursementDate: string | null;
}

export interface SpecialistReferral {
  id: string;
  consultationId: string;
  specialistType: SpecialistType;
  specialistId?: string; // Optional, may be assigned later
  reason: string;
  isCompleted: boolean;
  completionDate?: string;
}

export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  doctorId: string;
  date: string;
  notes?: string; // Updated to be optional
  medications: Medication[];
  // Fields from backend join queries
  patientName?: string; // New field
  doctorName?: string; // New field
  // Timestamps from MySQL
  createdAt?: string; // New field
  updatedAt?: string; // New field
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export enum ReimbursementStatus {
  PENDING = "En attente",
  APPROVED = "Approuvé",
  REJECTED = "Rejeté",
  PARTIAL = "Partiellement remboursé",
  COMPLETED = "Remboursé"
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  doctorId?: string; // For doctors
  profilePicture?: string; // URL to profile picture
}

export enum UserRole {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  SOCIAL_SECURITY_AGENT = "SOCIAL_SECURITY_AGENT"
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PrescriptionDetail extends Prescription {
  patient: Patient;
  doctor: Doctor;
}
