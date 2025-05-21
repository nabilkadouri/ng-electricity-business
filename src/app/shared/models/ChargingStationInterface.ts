import { ApiResponse } from "./ApiResponse";
import { BookingInterface } from "./BookingInterface";
import { LocationStationInterface } from "./LocationStationInterface";
import { TimeslotsInterface } from "./TimeslotsInterface";
import { UserInterface } from "./UserInterface";

export interface ChargingStationInterface extends ApiResponse {
    id: number;
    createAt: Date;
    nameStation: string;
    power: number,
    pricePerHour: number;
    picture: string;
    plugType: string;
    isAvailable: boolean;
    locationStation: LocationStationInterface;
    timeslots: TimeslotsInterface[];
    user: UserInterface;
    bookings: BookingInterface[]
}