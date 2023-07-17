import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.scss']
})
export class PasswordUpdateComponent extends BaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
     private userAuthService: UserAuthService, 
     private activatedRoute: ActivatedRoute,
     private alertifyService: AlertifyService,
     private userService: UserService,
     private router:Router
     ) {
    super(spinner);
  }
  state:any= { state: false };

  ngOnInit(): void {
    this.showSpinner(SpinnerType.BallSpinClockwise);
    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId = params["userId"];
        const resetToken = params["resetToken"];
        this.state = await this.userAuthService.verifyResetPasswordToken(resetToken, userId, () =>{
          this.hideSpinner(SpinnerType.BallSpinClockwise)} )
      }
    })
  }

  updateForgotPassword(password:string, passwordConfirm:string){
    this.showSpinner(SpinnerType.BallSpinClockwise);
    if(password !== passwordConfirm){
      this.alertifyService.message("Şifreler uyuşmuyor.", {
        messageType: MessageType.Error,
        position: Position.TopRight,
      });
      this.hideSpinner(SpinnerType.BallSpinClockwise);
      return;
    }
    this.activatedRoute.params.subscribe({
      next: async params => {
      const userId:string = params["userId"];
      const resetToken:string = params["resetToken"];
      await  this.userService.updateForgotPassword(password, passwordConfirm, userId, resetToken, () => {
        this.alertifyService.message("Şifreniz başarıyla güncellendi.", {
          messageType: MessageType.Success,
          position: Position.TopRight,
        });
        this.router.navigate(["/login"]);
      }, error => {
        console.log(error);
      })
      this.hideSpinner(SpinnerType.BallSpinClockwise);
    }}
  )}
}
