import { BookingResponseInterface } from "./BookingInterface";
import { LocationStationResponseInterface } from "./LocationStationInterface";
import { TimeslotsResponseInterface } from "./TimeslotsInterface";
import { PictureDetailsInterface } from "./PictureDetailsInterface";



export enum ChargingStationStatus {
    PENDING = 'En attente',
    CONFIRMED = 'Confirmée', 
    CANCELLED = 'Annulée',
  }


export interface ChargingStationResponseInterface {
    id: number ;
    createdAt: string;
    nameStation: string;
    description: string,
    power: number,
    pricePerHour: number;
    picture?: PictureDetailsInterface | null ;
    status: ChargingStationStatus,
    isAvailable: boolean;
    plugType: string;
    userId: number;
    locationStation: LocationStationResponseInterface;
    timeslots: TimeslotsResponseInterface[];
    bookings: BookingResponseInterface[]
}

export interface ChargingStationRequestInterface  {
    nameStation: string;
    description?: string,
    power: number,
    pricePerHour: number;
    picture?: PictureDetailsInterface | null ;
    status?: ChargingStationStatus,
    isAvailable?: boolean;
    locationStationId?: number;
    userId: number;
}

export interface ChargingStationFormModel {
    id?: number;
    nameStation: string;
    description?: string;
    power: number | null;
    pricePerHour: number | null;
    picture?: PictureDetailsInterface | null;
    status?:ChargingStationStatus
    isAvailable?: boolean;
    plugType?: string;
    userId?: number;
    locationStationId?: number;
    locationStation?: LocationStationResponseInterface;
}

export interface CharginStationInterfaceMap {
    picture?: any;
    id:number ;
    nameStation: string;
    power: number,
    pricePerHour: number;
    locationStation: LocationStationResponseInterface;
    timeslots: TimeslotsResponseInterface[];
}