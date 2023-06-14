import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoadComponentService {

  constructor() { }

  async loadComponent(component: ComponentName, viewContainerRef: ViewContainerRef ) {
    let _component: any = null;
    switch (component) {
      case ComponentName.CartComponent:
        _component = (await import('src/app/ui/components/cart/cart.component')).CartComponent;
        break;
    }
    viewContainerRef.clear();
    return viewContainerRef.createComponent(_component);

  
  }
}
export enum ComponentName {
  CartComponent
}
