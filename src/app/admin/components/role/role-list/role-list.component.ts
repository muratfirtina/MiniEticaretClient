import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Role } from 'src/app/contracts/role/list_role';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { RoleService } from 'src/app/services/common/models/role.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['name', 'edit', 'delete'];
  dataSource:MatTableDataSource<List_Role> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private roleService: RoleService,
     private alertifyService: AlertifyService,
     private dialogService: DialogService,
     spinner: NgxSpinnerService) {
    super(spinner);
  }
  


  
  async getRoles() {

    this.showSpinner(SpinnerType.BallSpinClockwise);

    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : 5;

    const allRoles: {totalCount: number; roles: List_Role[]} = await this.roleService.getRoles(pageIndex, pageSize, 
      () => this.hideSpinner(SpinnerType.BallSpinClockwise), 
      errorMessage => this.alertifyService.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
    }));

    this.dataSource = new MatTableDataSource<List_Role>(allRoles.roles);
    this.paginator.length = allRoles.totalCount;

    if (allRoles.roles.length === 0 && pageIndex > 0) {
      this.paginator.pageIndex = pageIndex - 1;
      await this.getRoles();
    }
  }
  
  
  async pageChanged(){
    await this.getRoles();
  }

  async ngOnInit(){
    await this.getRoles();
  }

  
  
}
