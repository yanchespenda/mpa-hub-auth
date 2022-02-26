interface WhoErrors {
  code: number;
  message: string;
}

export interface WhoError {
  message: string;
  data?: any;
  errors?: WhoErrors[];
}
