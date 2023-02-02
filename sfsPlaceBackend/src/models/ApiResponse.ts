export class ApiErrorResponse {
    public errorMessage: string = "";
    public errorCode: number = -1;
}

export default class ApiResponse {
    public message: string = "unknown message";
    public timestamp: number = Date.now();
    public error: ApiErrorResponse = new ApiErrorResponse();
}