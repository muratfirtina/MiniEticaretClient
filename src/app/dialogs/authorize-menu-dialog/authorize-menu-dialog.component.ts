import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from 'src/app/services/common/models/role.service';
import { RoleDto } from 'src/app/contracts/role/roleDto';
import { MatSelectionList } from '@angular/material/list';
import { AuthorizationEndpointService } from 'src/app/services/common/models/authorization-endpoint.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';

@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  styleUrls: ['./authorize-menu-dialog.component.scss']
})
export class AuthorizeMenuDialogComponent extends BaseDialog<AuthorizeMenuDialogComponent> implements OnInit {

  constructor(private roleService:RoleService,
    private authorizationEndpointService:AuthorizationEndpointService,
    private spinner:NgxSpinnerService,
    private alertfyService:AlertifyService,
    dialogRef: MatDialogRef<AuthorizeMenuDialogComponent>,
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
    this.assignedRoles = await this.authorizationEndpointService.getRolesToEndpoint(this.data.code, this.data.menuName);
    this.roleList = await this.roleService.getRoles(-1, -1, () => {}, error => {});
    
  }

  assignRoles(roleComponent){
   const roles: RoleDto[] = roleComponent.selectedOptions.selected.map(r => r.value);
   this.spinner.show(SpinnerType.BallSpinClockwise)
   this.authorizationEndpointService.assignRoleEndpoint(roles, this.data.code,this.data.menuName, ()=>{
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

export enum AuthorizeMenuDialogState {
  Yes,
  No
}
