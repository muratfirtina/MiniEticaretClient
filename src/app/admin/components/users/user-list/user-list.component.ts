import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { UserDto } from 'src/app/contracts/user/userDto';
import { AuthorizeUserDialogComponent } from 'src/app/dialogs/authorize-user-dialog/authorize-user-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['userName', 'email', 'nameSurname', 'twoFactorEnabled' ,'role', 'delete'];
  dataSource:MatTableDataSource<UserDto> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userService: UserService,
     private alertifyService: AlertifyService,
     private dialogService: DialogService,
     spinner: NgxSpinnerService) {
    super(spinner);
  }

  async getAllUsers() {

    this.showSpinner(SpinnerType.BallSpinClockwise);
  
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : 5;
  
    const allUsers: {totalCount: number; users: UserDto[]} = await this.userService.getAllUsers(pageIndex, pageSize, 
      () => this.hideSpinner(SpinnerType.BallSpinClockwise), 
      errorMessage => this.alertifyService.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
    }));
  
    this.dataSource = new MatTableDataSource<UserDto>(allUsers.users);
    this.paginator.length = allUsers.totalCount;
  
    if (allUsers.users.length === 0 && pageIndex > 0) {
      this.paginator.pageIndex = pageIndex - 1;
      await this.getAllUsers();
    }
  }
  
  
  async pageChanged(){
    await this.getAllUsers();
  }

  async ngOnInit(){
    await this.getAllUsers();
  }

  assingRole(id:string){
    this.dialogService.openDialog({
      componentType : AuthorizeUserDialogComponent,
      data : id,
    });
  }

  /* showDetail(id: string){
    this.dialogService.openDialog({
      componentType : UserDetailDialogComponent,
      data : id,
    });
  } */

}
