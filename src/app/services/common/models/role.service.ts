import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { RoleDto } from 'src/app/contracts/role/roleDto';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClientService:HttpClientService) { }

  async create(name: string, successCallBack?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "roles"
    }, { roleName: name});

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack)
      .catch(errorCallBack);

    return await promiseData as { succeeded: boolean };
  }

  async getRoles(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (error) => void):Promise<{totalCount:number, roles:RoleDto[]}> {
    const observable: Observable<{totalCount:number, roles:RoleDto[]}> = this.httpClientService.get({
      controller: "roles",
      queryString: `page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack)
      .catch(errorCallBack);

    return await promiseData;
  }

  async deleteRole(roleId: string, successCallBack?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.delete({
        controller: "roles"
    }, roleId);

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack)
        .catch(errorCallBack);

    return await promiseData as { succeeded: boolean };
}

}

