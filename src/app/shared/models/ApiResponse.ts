export interface ApiResponse {
    '@context': string;
    '@id': string;
    '@type': string;
  }

  export interface ApiListResponse<T> {
    '@context': string;
    '@id': string;
    'totalItems': number;
    'member': T[];
  }