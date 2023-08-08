import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, first, firstValueFrom } from 'rxjs';
import { MenuDto } from 'src/app/contracts/application-configuration/menu';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private httpClientService:HttpClientService) { }

  async getAuthorizeDefinitionEndpoints(){
    const observable: Observable<MenuDto[]> = this.httpClientService.get<MenuDto[]>({
      controller: 'ApplicationServices',
    });

    return await firstValueFrom(observable);
  }
}
