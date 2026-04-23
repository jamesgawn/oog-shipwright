export class APIResponse<T> {
  public code: number;
  public message: string;
  public data?: T;

  constructor(code: number, message: string, data?: T | undefined) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static ok<T>(data?: T) {
    return new APIResponse<T>(200, "Ok", data);
  }
  
  static notfound<T>(message:string = "Not Found", data?: T) {
    return new APIResponse<T>(404, message, data);
  }

  static badrequest<T>(message:string, data?: T) {
    return new APIResponse<T>(400, message, data);
  }

  static error<T>(message:string, data?: T) {
    return new APIResponse<T>(500, message, data);
  }
}