import { Inject, Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { SpinnerType } from "src/app/base/base.component";
import { ToastrMessageType, ToastrPosition } from "src/app/services/ui/custom-toastr.service";
import { CustomToastrService } from "src/app/services/ui/custom-toastr.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { _isAuthenticated } from "src/app/services/common/auth.service";


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot,state: RouterStateSnapshot) => {

    const jwtHelper = inject(JwtHelperService);
    const router = inject(Router);
    const toastrService = inject(CustomToastrService);
    const spinner = inject(NgxSpinnerService);
    
     spinner.show(SpinnerType.BallSpinClockwise);
      /* const token: string = localStorage.getItem("accessToken");

      //const decodeToken = this.jwtHelper.decodeToken(token);
      //const expitationDate:Date = this.jwtHelper.getTokenExpirationDate(token);
      
      let isExpired: boolean;
      try {
        isExpired = jwtHelper.isTokenExpired(token);
      } catch (error) {
        isExpired = true;
      } */
      if (!_isAuthenticated){
        router.navigate(["login"], {queryParams: {returnUrl: state.url}});
        toastrService.message("You are not authorized to access this page.", "Error",{
          toastrMessageType:ToastrMessageType.Warning,
          position: ToastrPosition.TopRight
        });
      }

      spinner.hide(SpinnerType.BallSpinClockwise);
      
      return true;
    
}

