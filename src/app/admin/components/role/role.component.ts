import { Component, ViewChild } from '@angular/core';
import { RoleListComponent } from './role-list/role-list.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {

  constructor() { }

  @ViewChild(RoleListComponent) roleListComponent: RoleListComponent;

  createdRole(createdRole: string) {
    this.roleListComponent.getRoles();
  }


}
