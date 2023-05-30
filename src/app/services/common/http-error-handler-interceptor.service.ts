import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private toastrService:CustomToastrService, private userAuthService:UserAuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(catchError(error => {
      switch (error.status) {
        case HttpStatusCode.InternalServerError:
          this.toastrService.message("The server is unreachable","Server Error",{
            toasterMessageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
        case HttpStatusCode.BadRequest:
          this.toastrService.message("Invalid request.", "Unauthorized operation!",{
            toasterMessageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopCenter
          });
          break;
        case HttpStatusCode.NotFound:
          this.toastrService.message("Page not found.", "Page not found!",{
            toasterMessageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopCenter
          });
          break;
        case HttpStatusCode.Unauthorized:
          this.toastrService.message("You don't have permission or your authorization has expired.", "Unauthorized operation!",{
            toasterMessageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken")).then(data => {
            
          })
          break;
          default:
            this.toastrService.message("An unexpected error occurred.", "Error!",{
              toasterMessageType: ToastrMessageType.Warning,
              position: ToastrPosition.BottomFullWidth
            });
            break;
      }
      return of(error);
    }));
    
    
  }
}
