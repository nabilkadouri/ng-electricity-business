import { PictureDetailsInterface } from "./PictureDetailsInterface";



export enum BookingStatus {
  PENDING = 'En attente',
  CONFIRMED = 'Confirmée', 
  CANCELLED = 'Annulée',
}

export enum PaymentMethod {
  CB = "CB",
  PAYPAL = "PayPal",
}

export interface BookingResponseInterface {
  id: number;
  createdAt: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: BookingStatus;
  user: {
    name: string,
    firstName: string,
    profilePicture: PictureDetailsInterface
  };
  chargingStation: {
    id: number;
    nameStation: string;
    power: number,
    plugType: string;
  };
}


export interface BookingRequestInterface {
  startDate: string,
  endDate: string,
  paymentType?: PaymentMethod;
  userId: number,
  chargingStationId: number,
}

export interface FlattenedBooking extends BookingResponseInterface {
    stationName: string; 
  }

export interface HourlySlotInterface {
  time: string,
  status: 'Disponible'  | 'Indisponible'
}