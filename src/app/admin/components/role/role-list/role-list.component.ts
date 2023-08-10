import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { RoleDto } from 'src/app/contracts/role/roleDto';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { RoleService } from 'src/app/services/common/models/role.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'edit', 'delete'];
  dataSource:MatTableDataSource<RoleDto> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedRoles: RoleDto[] = []

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

    const allRoles: {totalCount: number; roles: RoleDto[]} = await this.roleService.getRoles(pageIndex, pageSize, 
      () => this.hideSpinner(SpinnerType.BallSpinClockwise), 
      errorMessage => this.alertifyService.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
    }));

    this.dataSource = new MatTableDataSource<RoleDto>(allRoles.roles);
    this.paginator.length = allRoles.totalCount;

    if (allRoles.roles.length === 0 && pageIndex > 0) {
      this.paginator.pageIndex = pageIndex - 1;
      await this.getRoles();
    }
    
  }

  selectRole(role: RoleDto) {
    const index = this.selectedRoles.findIndex(r => r.roleId === role.roleId);
    if (index !== -1) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(role);
    }
  }

  selectAllRoles() {
    if (this.selectedRoles.length === this.dataSource.data.length) {
      this.selectedRoles = [];
    } else {
      this.selectedRoles = [...this.dataSource.data];
    }
  }

  async deleteSelectedRoles() {
    if (this.selectedRoles.length === 0) {
        return;
    }

    this.showSpinner(SpinnerType.BallSpinClockwise);

    try {
        for (const role of this.selectedRoles) {
            await this.roleService.deleteRole(role.roleId);
        }

        this.alertifyService.message('Selected roles deleted', {
            dismissOthers: true,
            messageType: MessageType.Success,
            position: Position.TopRight
        });

        this.selectedRoles = [];
        await this.getRoles();
    } catch (error) {
        this.alertifyService.message('An unexpected error occurred while deleting roles', {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight
        });
    }

    this.hideSpinner(SpinnerType.BallSpinClockwise);
}
  
  
  
  async pageChanged(){
    await this.getRoles();
  }

  async ngOnInit(){
    await this.getRoles();
  }

  
  
}
