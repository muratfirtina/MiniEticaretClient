import { SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { TokenResponse } from 'src/app/contracts/token/responseToken';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClientService: HttpClientService, private toastrService : CustomToastrService) { }


  async login(userNameOrEmail: string, password: string, callBackFunction?:() => void): Promise<any>{
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "auth",
      action: "login"
    }, {
      userNameOrEmail, password}
    );

    const tokenResponse : TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if(tokenResponse){
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);

      this.toastrService.message("Login successful", "Success",{
        toastrMessageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      })
      
    }
    callBackFunction();
  } 

  async refreshTokenLogin(refreshToken: string, callBackFunction?:(state) => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "auth",
      action: "refreshtokenlogin"
    }, {refreshToken: refreshToken});

    try{
      const tokenResponse : TokenResponse = await firstValueFrom(observable) as TokenResponse;
      if(tokenResponse){
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      }
      callBackFunction(tokenResponse ? true : false);

    }catch{
      callBackFunction(false);
    }
  }

  async googleLogin(user:SocialUser, callBackFunction?:()=> void): Promise<any>{
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      action:"google-login",
      controller:"auth"
    },user);

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if(tokenResponse){
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      this.toastrService.message("Login successful with Google", "Success",{
        toastrMessageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    }
    callBackFunction();
  }

  async facebookLogin(user:SocialUser, callBackFunction?:()=> void): Promise<any>{
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      action:"facebook-login",
      controller:"auth"
    },user);

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if(tokenResponse){
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      this.toastrService.message("Login successful with Facebook", "Success",{
        toastrMessageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    }
    callBackFunction();

  
  }
  
  async passwordReset(email: string, callBackFunction?:()=> void): Promise<any>{
    const observable: Observable<any> = this.httpClientService.post<any>({
      action:"password-reset",
      controller:"auth"
    },{email: email});

    await firstValueFrom(observable);
    callBackFunction();
  }

  async verifyResetPasswordToken(resetToken: string, userId:string, callBackFunction?:()=> void): Promise<boolean>{
    const observable: Observable<any> = this.httpClientService.post<any>({
      action:"verify-reset-password-token",
      controller:"auth"
    },{resetToken: resetToken, userId: userId});

    const state: boolean = await firstValueFrom(observable);
    callBackFunction();
    return state;
  }


}
