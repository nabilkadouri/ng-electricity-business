

export enum DayOfWeek {
    MONDAY  = "Lundi",
    TUESDAY = "Mardi",
    WEDNESDAY = "Mercredi",
    THURSDAY = "Jeudi",
    FRIDAY = "Vendredi",
    SATURDAY = "Samedi",
    SUNDAY = "Dimanche"
}

export interface TimeslotsResponseInterface{
    id: number,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    chargingStationId?: number
}

export interface TimeslotRequestInterface {
    dayOfWeek: DayOfWeek;
    startTime: String ; 
    endTime: String; 
    chargingStationId: number 
}


export interface TimeslotsMapInterface{
    id: number,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
}