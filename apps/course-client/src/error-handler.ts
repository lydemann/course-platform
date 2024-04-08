import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CustomErrorHandler extends ErrorHandler {
  handleError(error: any): void {
    console.error('Error from global error handler', error);
    super.handleError(error);
  }
}
