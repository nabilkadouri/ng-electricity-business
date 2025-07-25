   
    export interface LoginRequestInterface {
        email: string;
        password: string;
    }

    export interface IToken{
        token: string;
    }

    export interface LoginInitialResponse {
        message: string;
    }

    export interface LoginResponseInterface {
        accessToken: string;
        refreshToken: string;
    }
    
    export interface CodeCheckRequestInterface {
    email: string;
    codeCheck: string ;
    }

    export interface RegisterRequestInterface {
        email: string;
        password: string;
        name: string;
        firstName: string;
        address: string;
        postaleCode: string;
        city: string;
        phoneNumber?: string;
        latitude?: number,
        longitude?: number,
    }

    export interface Coordinates {
        latitude: number;
        longitude: number;
      }

