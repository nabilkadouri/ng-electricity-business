
import { BookingResponseInterface } from "./BookingInterface";
import { ChargingStationResponseInterface } from "./ChargingStationInterface";
import { PictureDetailsInterface } from "./PictureDetailsInterface";

export interface UserResponseInterface {
    id: number,
    email: string,
    name: string,
    firstName: string,
    address: string,
    postaleCode: string,
    city: string,
    latitude?: number; 
    longitude?: number;
    phoneNumber: string,
    ownsStation: boolean,
    profilePicture: PictureDetailsInterface,
    role : string,
    bookings: BookingResponseInterface[],
    chargingStations: ChargingStationResponseInterface[]
}


export interface UserEmailUpdateInterface {
    email: string
}

export interface UserUpdateRequestInterface {
    email?: string; 
    name?: string;
    firstName?: string;
    address?: string;
    postaleCode?: string;
    city?: string;
    phoneNumber?: string;
    password?: string;
  }


