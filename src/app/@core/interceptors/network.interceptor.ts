import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { OnlineStatService } from '../utils/online-stat.service';
import { switchMap, take } from 'rxjs/operators';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {

  readonly methodsForCheck = [
    'POST',
    'PUT',
  ]

  constructor(
    private onlineStatService: OnlineStatService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.onlineStatService
      .isOnlineSub
      .pipe(
        take(1),
        switchMap((isOnline) => {
          // if request does not send data, skip evaluation
          if (!this.methodsForCheck.includes(request.method.toUpperCase())) {
            return next.handle(request);
          }

          // if offline, send back error
          if (!isOnline) {
            return of(new HttpResponse<ResponseDto<any>>({
              status: 400,
              body: {
                status: false,
                message: 'A network connection could not be established'
              }
            })
            )
          }
          return next.handle(request);
        })
      )
  }
}
