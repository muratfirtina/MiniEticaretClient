import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'src/app/entities/user';
import { Create_User } from 'src/app/contracts/user/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { Token } from 'src/app/contracts/token/token';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { TokenResponse } from 'src/app/contracts/token/responseToken';
import { SocialUser } from '@abacritt/angularx-social-login';
import { UserDto } from 'src/app/contracts/user/userDto';
import { RoleDto } from 'src/app/contracts/role/roleDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService, private toastrService : CustomToastrService) { }

 async create(user:User): Promise<Create_User> {
    const observable: Observable<Create_User | User> = this.httpClientService.post<Create_User | User>({
      controller: "users"
    }, user);

    return await firstValueFrom(observable) as Create_User;
  }

  async updateForgotPassword(password:string, passwordConfirm:string, userId:string, resetToken:string, successCallBack?: () => void, errorCallBack?: (error) => void){
    const observable: Observable<any> = this.httpClientService.post<any>({
      controller: "users",
      action: "update-forgot-password"
    }, {
      password: password, passwordConfirm : passwordConfirm, userId:userId, resetToken:resetToken}
    );

    const promiseData : Promise<any> = firstValueFrom(observable);
    promiseData.then(value => successCallBack()).catch(error => errorCallBack(error));
    await promiseData;

  }

  async getAllUsers(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number; users: UserDto[] }> {
    const observable: Observable<{ totalCount: number; users: UserDto[] }> = this.httpClientService.get({
      controller: "users",
      queryString: `page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error));

    return await promiseData;
  }

  async assignRoleToUser(userId: string, roles: RoleDto[], successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "assign-role-to-user"
    }, {
      userId: userId,
      roles: roles
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error));

    await promiseData;
  }

  async getRolesToUser(userId: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<RoleDto[]> {
    const observable: Observable<{userRoles: RoleDto[]}> = this.httpClientService.get({
      controller: "users",
      action: "get-roles-to-user"
    },
      userId
    );

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error));

    return (await promiseData).userRoles;
  }


}
