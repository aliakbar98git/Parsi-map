export interface IResponse<T = any> {
  statusCode: number;
  messageCode: number;
  message: string | null;
  messageParameters: any[];
  data: T
}
