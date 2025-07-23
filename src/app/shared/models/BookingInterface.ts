

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
    id: number,
    createdAt: string,
    startDate: string,
    endDate: string,
    totalAmount: number,
    status: BookingStatus,
    userId: number,
    chargingStationId: number,
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