    export interface RegisterRequest{
    email?: string,
    password?: string,
    name?: string,
    firstName?: string,
    address?: string,
    postaleCode?: string,
    city?: string,
    phoneNumber?: string 
    }

    export interface LoginRequest {
        username?: string;
        password?: string;
    }

    export interface IToken{
        token: string;
    }

    export interface LoginSuccessResponse {
        login: string;
        two_factor_complete: boolean;
    }
    
    export interface CodeCheckRequest {
    codeCheck?: string ;
    }

