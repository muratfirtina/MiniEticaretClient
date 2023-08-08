import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { RoleService } from 'src/app/services/common/models/role.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss']
})
export class RoleCreateComponent extends BaseComponent implements OnInit {

  constructor(spinner:NgxSpinnerService, private alertify:AlertifyService, private roleService:RoleService) {
    super(spinner);
  }
  ngOnInit(): void {
    
  }

  @Output() createdRole : EventEmitter<string>= new EventEmitter();


  create(name: HTMLInputElement) {
    this.showSpinner(SpinnerType.BallSpinClockwise);


    this.roleService.create(name.value, () => {
      this.hideSpinner(SpinnerType.BallSpinClockwise);
      this.alertify.message("Role başarıyla eklenmiştir.", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight
      });
      this.createdRole.emit(name.value);
    }, errorMessage => {
      this.alertify.message(errorMessage,
        {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
    });
  }
}
