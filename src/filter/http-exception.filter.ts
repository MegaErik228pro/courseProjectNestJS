import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = exception.getResponse();
    const errorMessage = (errorResponse as any).message;
    console.log(status + ': ' + errorMessage);

    if (status == 400)
    {
      if (request.url.endsWith('%20'))
        response.redirect('https://localhost:8000' + request.url.substring(0, request.url.lastIndexOf('/')) + '/' + errorMessage);
      else
        response.redirect('https://localhost:8000' + request.url + '/' + errorMessage);
    }
    else
    {
        response.redirect('/errorPage/' + status + '/' + errorMessage);
    }
  }
}