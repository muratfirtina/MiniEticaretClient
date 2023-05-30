import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent{
  
  constructor(
    private userAuthService:UserAuthService,
    spinner: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router ,
    private socialAuthService: SocialAuthService) { 
    super(spinner);
    socialAuthService.authState.subscribe(async(user:SocialUser) => {
      console.log(user)
      this.showSpinner(SpinnerType.BallSpinClockwise);
      switch(user.provider){
        case "GOOGLE":
          await userAuthService.googleLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallSpinClockwise)
            
            })
          break;
        case "FACEBOOK":
          await userAuthService.facebookLogin(user, () => {
            this.authService.identityCheck();
            sessionStorage.clear();
            this.hideSpinner(SpinnerType.BallSpinClockwise)
            });
          break;
      }
      const returnUrl: string = this.activatedRoute.snapshot.queryParams["returnUrl"];
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigateByUrl("/")
        }
    });
    
    
  }

  async login(userNameOrEmail: string, password: string){  
   this.showSpinner(SpinnerType.BallSpinClockwise);
   await this.userAuthService.login(userNameOrEmail, password, () => {
    this.authService.identityCheck();
    sessionStorage.clear();
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

  facebookLogin(){
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
