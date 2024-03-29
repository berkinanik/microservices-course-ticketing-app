export interface CommonErrorResponse {
  errors: {
    message: string;
    field?: string;
  }[];
}
