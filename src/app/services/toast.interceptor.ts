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
              this.handleSuccess(req, event);
            }
          }
        },
        (error: HttpErrorResponse) => {
          this.handleError(req, error);
        }
      )
    );
  }

  private handleSuccess(req: HttpRequest<any>, event: HttpResponse<any>) {
    let message = this.translate.instant('OPERATION_COMPLETED_SUCCESSFULLY');

    if (req.method === 'GET') {
      message = this.translate.instant('DATA_SUCCESSFULLY_RETRIEVED');
    } else if (req.method === 'POST') {
      message = this.translate.instant('EMPLOYEE_SUCCESSFULLY_ADDED');
    } else if (req.method === 'PUT') {
      message = this.translate.instant('EMPLOYEE_SUCCESSFULLY_UPDATED');
    } else if (req.method === 'DELETE') {
      message = this.translate.instant('EMPLOYEE_SUCCESSFULLY_DELETED');
    }

    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('SUCCESS'),
      detail: message,
    });
  }

  private handleError(req: HttpRequest<any>, error: HttpErrorResponse) {
    let message = this.translate.instant('AN_ERROR_OCCURRED');

    if (req.method === 'GET') {
      message = this.translate.instant('ERROR_RETRIEVING_DATA');
    } else if (req.method === 'POST') {
      message = this.translate.instant('ERROR_ADDING_EMPLOYEE');
    } else if (req.method === 'PUT') {
      message = this.translate.instant('ERROR_UPDATING_EMPLOYEE');
    } else if (req.method === 'DELETE') {
      message = this.translate.instant('ERROR_DELETING_EMPLOYEE');
    }

    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('ERROR'),
      detail: message,
    });
  }
}
