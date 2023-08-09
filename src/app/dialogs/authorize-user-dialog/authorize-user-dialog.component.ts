import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { RoleService } from 'src/app/services/common/models/role.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { RoleDto } from 'src/app/contracts/role/roleDto';
import { SpinnerType } from 'src/app/base/base.component';
import { UserService } from 'src/app/services/common/models/user.service';
import { UserDto } from 'src/app/contracts/user/userDto';

@Component({
  selector: 'app-authorize-user-dialog',
  templateUrl: './authorize-user-dialog.component.html',
  styleUrls: ['./authorize-user-dialog.component.scss']
})
export class AuthorizeUserDialogComponent extends BaseDialog<AuthorizeUserDialogComponent> implements OnInit {

  constructor(private roleService:RoleService,
    private userService:UserService,
    private spinner:NgxSpinnerService,
    private alertfyService:AlertifyService,
    dialogRef: MatDialogRef<AuthorizeUserDialogComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any ) {
    super(dialogRef);
  }
  @ViewChild(MatSelectionList)
  roleComponent!: MatSelectionList

  roleList: { roles: RoleDto[], totalCount: number } = { roles: [], totalCount: 0 };
  roles: RoleDto[] = [];
  totalCount: number = 0;
  assignedRoles:RoleDto[]=[]
 

  async ngOnInit() {
    this.spinner.show(SpinnerType.BallSpinClockwise);
    this.assignedRoles = await this.userService.getRolesToUser(this.data, () => {}, error => {});
    this.spinner.hide(SpinnerType.BallSpinClockwise);
    this.roleList = await this.roleService.getRoles(-1, -1, () => {}, error => {});
    
  }

  assignRoles(roleComponent){
   const roles: RoleDto[] = roleComponent.selectedOptions.selected.map(r => r.value);
   this.spinner.show(SpinnerType.BallSpinClockwise)
   this.userService.assignRoleToUser(this.data,roles, ()=>{
    this.alertfyService.message("Yenkilendirme başarılı", {
      dismissOthers: true,
      messageType: MessageType.Success,
      position: Position.TopRight
    });
    this.spinner.hide(SpinnerType.BallSpinClockwise);

   }, error => {

   })
  }

  isRoleAssigned(role: RoleDto): boolean {
    return this.assignedRoles.some(assignedRole => assignedRole.roleId === role.roleId);
  }


}

