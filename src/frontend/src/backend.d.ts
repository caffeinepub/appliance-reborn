import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type BookingId = bigint;
export interface BookingRequest {
    serviceType: ServiceType;
    name: string;
    description: string;
    email: string;
    preferredDate: string;
    address: string;
    applianceType: ApplianceType;
    phone: string;
}
export interface BookingCounts {
    cancelled: bigint;
    pending: bigint;
    completed: bigint;
    confirmed: bigint;
}
export interface Booking {
    id: BookingId;
    status: BookingStatus;
    serviceType: ServiceType;
    name: string;
    description: string;
    email: string;
    preferredDate: string;
    address: string;
    timestamp: bigint;
    applianceType: ApplianceType;
    phone: string;
}
export interface Testimonial {
    id: bigint;
    content: string;
    author: string;
    timestamp: bigint;
    rating: bigint;
}
export enum ApplianceType {
    HobChula = "HobChula",
    Chimney = "Chimney",
    Dryer = "Dryer",
    WashingMachine = "WashingMachine",
    Microwave = "Microwave",
    Dishwasher = "Dishwasher"
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum ServiceType {
    Repair = "Repair",
    Servicing = "Servicing",
    Installation = "Installation"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTestimonial(author: string, content: string, rating: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(request: BookingRequest): Promise<BookingId>;
    deleteBooking(bookingId: BookingId): Promise<void>;
    deleteTestimonial(id: bigint): Promise<void>;
    getBookingCounts(): Promise<BookingCounts>;
    getBookings(): Promise<Array<Booking>>;
    getCallerUserRole(): Promise<UserRole>;
    getTestimonials(): Promise<Array<Testimonial>>;
    isCallerAdmin(): Promise<boolean>;
    updateBookingStatus(bookingId: BookingId, status: BookingStatus): Promise<void>;
    updateTestimonial(id: bigint, author: string, content: string, rating: bigint): Promise<void>;
}
