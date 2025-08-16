export interface CommonApiResponse<T = any> {
    code: number;          // HTTP code or custom API code
    data: T;               // Payload (generic type)
    message: string;       // Success or error message
    status: boolean;       // true = success, false = error
}
