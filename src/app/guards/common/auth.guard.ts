import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toast } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { SpinnerType } from 'src/app/base/base.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private jwtHelper:JwtHelperService,
    private router:Router,
    private toastrService:CustomToastrService,
    private spinner:NgxSpinnerService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      this.spinner.show(SpinnerType.BallSpinClockwise);
      const token: string = localStorage.getItem("accessToken");

      //const decodeToken = this.jwtHelper.decodeToken(token);
      //const expitationDate:Date = this.jwtHelper.getTokenExpirationDate(token);
      
      let isExpired: boolean;
      try {
        isExpired = this.jwtHelper.isTokenExpired(token);
      } catch (error) {
        isExpired = true;
      }
      if (!token || isExpired){
        this.router.navigate(["login"], {queryParams: {returnUrl: state.url}});
        this.toastrService.message("You are not authorized to access this page.", "Error",{
          toasterMessageType:ToastrMessageType.Warning,
          position: ToastrPosition.TopRight
        });
      }

      this.spinner.hide(SpinnerType.BallSpinClockwise);
      
      return true;
    
  }
}
