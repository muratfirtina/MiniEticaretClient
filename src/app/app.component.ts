import { Component } from '@angular/core';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { AuthService } from './services/common/auth.service';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public authService: AuthService,
    private toastrService: CustomToastrService,
    private router: Router,
    private socialAuthService: SocialAuthService) {
    authService.identityCheck();
  }
  

  signOut() {
    localStorage.removeItem("accessToken");
    this.socialAuthService.signOut().then(() => {location.reload()});
    this.authService.identityCheck();
    this.router.navigateByUrl("");
    this.toastrService.message("Logged out successfully","Log Out ",{
      toasterMessageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopRight
    })
  }
}

