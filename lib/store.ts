// Client-side store using localStorage for the passenger app simulation

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  photo: string; // placeholder URL
  emergencyContacts: { name: string; phone: string }[];
}

export interface PaymentMethod {
  id: string;
  type: "cash" | "card" | "transfer";
  label: string;
  last4?: string;
  isDefault: boolean;
}

export interface TripRecord {
  id: string;
  date: string;
  origin: string;
  originCoords?: { lat: number; lng: number };
  destination: string;
  service: string;
  fare: number;
  negotiatedFare?: number;
  distance: number;
  duration: number;
  driver: DriverInfo;
  rating: number;
  driverRatingToUser?: number;
  tip: number;
  paymentMethod: string;
  status: "completed" | "cancelled";
}

export interface DriverInfo {
  name: string;
  photo: string;
  plate: string;
  vehicle: string;
  vehicleColor: string;
  rating: number;
  trips: number;
  siteNumber: string; // sitio de taxi
  verified: boolean;
}

export type ServiceType = "normal" | "grande" | "accesible" | "ejecutivo";

const STORAGE_KEY = "mtj_app";

interface AppData {
  profile: UserProfile;
  payments: PaymentMethod[];
  trips: TripRecord[];
  onboarded: boolean;
}

const DEFAULT_DATA: AppData = {
  profile: {
    name: "",
    phone: "",
    email: "",
    photo: "",
    emergencyContacts: [],
  },
  payments: [
    { id: "cash", type: "cash", label: "Efectivo", isDefault: true },
  ],
  trips: [
    {
      id: "demo-1",
      date: "2026-04-10T14:30:00",
      origin: "Av. Chapultepec 450, Americana",
      destination: "Plaza del Sol, Zapopan",
      service: "normal",
      fare: 68,
      distance: 8.4,
      duration: 18,
      driver: { name: "Roberto Mendoza", photo: "", plate: "JAL-1234", vehicle: "Nissan Tsuru 2018", vehicleColor: "Blanco", rating: 4.97, trips: 1284, siteNumber: "Sitio 42", verified: true },
      rating: 5,
      driverRatingToUser: 5,
      tip: 20,
      paymentMethod: "Efectivo",
      status: "completed",
    },
    {
      id: "demo-2",
      date: "2026-04-08T19:15:00",
      origin: "Providencia, Zapopan",
      destination: "Andares, Zapopan",
      service: "normal",
      fare: 95,
      distance: 5.1,
      duration: 22,
      driver: { name: "Luis García", photo: "", plate: "JAL-5678", vehicle: "VW Vento 2020", vehicleColor: "Gris", rating: 4.85, trips: 834, siteNumber: "Sitio 15", verified: true },
      rating: 4,
      tip: 10,
      paymentMethod: "Tarjeta •••• 4821",
      status: "completed",
    },
    {
      id: "demo-3",
      date: "2026-04-05T06:00:00",
      origin: "Col. Americana",
      destination: "Aeropuerto GDL",
      service: "grande",
      fare: 280,
      distance: 18.5,
      duration: 35,
      driver: { name: "Pedro Salazar", photo: "", plate: "JAL-9012", vehicle: "Chevrolet Aveo 2019", vehicleColor: "Azul", rating: 4.72, trips: 567, siteNumber: "Sitio 8", verified: true },
      rating: 5,
      tip: 50,
      paymentMethod: "Transferencia",
      status: "completed",
    },
  ],
  onboarded: false,
};

export function loadAppData(): AppData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_DATA;
}

export function saveAppData(data: Partial<AppData>) {
  if (typeof window === "undefined") return;
  const current = loadAppData();
  const merged = { ...current, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function addTrip(trip: TripRecord) {
  const data = loadAppData();
  data.trips = [trip, ...data.trips];
  saveAppData(data);
}

export function updateProfile(profile: UserProfile) {
  saveAppData({ profile, onboarded: true });
}

export function updatePayments(payments: PaymentMethod[]) {
  saveAppData({ payments });
}

// Simulated drivers pool
export const DRIVERS: DriverInfo[] = [
  { name: "Roberto Mendoza", photo: "", plate: "JAL-1234", vehicle: "Nissan Tsuru 2018", vehicleColor: "Blanco", rating: 4.97, trips: 1284, siteNumber: "Sitio 42", verified: true },
  { name: "Luis García", photo: "", plate: "JAL-5678", vehicle: "VW Vento 2020", vehicleColor: "Gris", rating: 4.85, trips: 834, siteNumber: "Sitio 15", verified: true },
  { name: "María Hernández", photo: "", plate: "JAL-3456", vehicle: "Chevrolet Beat 2021", vehicleColor: "Rojo", rating: 4.92, trips: 1567, siteNumber: "Sitio 27", verified: true },
  { name: "Pedro Salazar", photo: "", plate: "JAL-9012", vehicle: "Chevrolet Aveo 2019", vehicleColor: "Azul", rating: 4.72, trips: 567, siteNumber: "Sitio 8", verified: true },
  { name: "Ana López", photo: "", plate: "JAL-7890", vehicle: "Toyota Yaris 2022", vehicleColor: "Blanco", rating: 4.95, trips: 2103, siteNumber: "Sitio 3", verified: true },
];

export function getRandomDriver(): DriverInfo {
  return DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
}

// Fare calculation
export function calculateFare(distanceKm: number, service: ServiceType): number {
  const base: Record<ServiceType, number> = { normal: 35, grande: 45, accesible: 40, ejecutivo: 55 };
  const perKm: Record<ServiceType, number> = { normal: 5.5, grande: 7, accesible: 6, ejecutivo: 8 };
  return Math.round(base[service] + distanceKm * perKm[service]);
}
