import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: object;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => 
  res.status(data.statusCode).json(data);

export default sendResponse;
