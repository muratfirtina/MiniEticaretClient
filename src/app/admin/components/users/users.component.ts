import { Component, ViewChild } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  constructor() { }

  @ViewChild(UserListComponent) userListComponent: UserListComponent;

}
