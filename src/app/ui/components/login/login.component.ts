import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { TokenResponse } from 'src/app/contracts/token/responseToken';
import { AuthService } from 'src/app/services/common/auth.service';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent{
  
  constructor(
    private userService:UserService,
    spinner: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router ,
    private socialAuthService: SocialAuthService) { 
    super(spinner);
    socialAuthService.authState.subscribe(async(user:SocialUser) => {
      console.log(user)
      this.showSpinner(SpinnerType.BallSpinClockwise);
      await userService.googleLogin(user, () => {
        this.authService.identityCheck();
        const returnUrl: string = this.activatedRoute.snapshot.queryParams["returnUrl"];
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigateByUrl("/").then(() => {
            location.reload();
          });; // Ana sayfaya yönlendir
        }
        this.hideSpinner(SpinnerType.BallSpinClockwise)})
      
    });
  }

  async login(userNameOrEmail: string, password: string){  
   this.showSpinner(SpinnerType.BallSpinClockwise);
   await this.userService.login(userNameOrEmail, password, () => {
    this.authService.identityCheck();
    this.activatedRoute.queryParams.subscribe(params => {
      const returnUrl: string = params['returnUrl'];
      if(returnUrl){
        this.router.navigateByUrl(returnUrl);
      }
      else{
        this.router.navigateByUrl("");
      }
    });
    this.hideSpinner(SpinnerType.BallSpinClockwise)});
  }

  
}
