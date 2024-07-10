import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ToastInterceptor implements HttpInterceptor {
  constructor(
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.status === 200 || event.status === 201) {
              this.messageService.add({
                severity: 'success',
                summary: this.translate.instant('SUCCESS'),
                detail: this.translate.instant(
                  'OPERATION_COMPLETED_SUCCESSFULLY'
                ),
              });
            }
          }
        },
        (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('ERROR'),
            detail: this.translate.instant('AN_ERROR_OCCURRED'),
          });
        }
      )
    );
  }
}
