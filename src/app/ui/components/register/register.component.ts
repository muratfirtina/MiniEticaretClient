import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/base/base.component';
import { Create_User } from 'src/app/contracts/user/create_user';
import { User } from 'src/app/entities/user';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit{

  constructor(
    private formBuilder:FormBuilder, 
    private userService: UserService, 
    private toastrService: CustomToastrService,
    spinner: NgxSpinnerService ) { 
    super(spinner);
  }

  frm: FormGroup;
  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      nameSurname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['',[Validators.required, Validators.minLength(3)]],
      confirmPassword: ['',[Validators.required,Validators.minLength(3), this.passwordsMatchValidator]]
    });   

  }

  passwordsMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.root.get('password');
    return password && control.value !== password.value ? { 'notSame': true } : null;
  }
  get component() { return this.frm.controls; }

  submitted: boolean = false;
  async onSubmit(user:User){
    this.submitted = true;
    if(this.frm.invalid) return;
    
  const result : Create_User = await this.userService.create(user);

    if(result.isSuccess){
      this.toastrService.message(result.message,"User Created Successfully",{
        toasterMessageType: ToastrMessageType.Success,
        position:ToastrPosition.TopRight

      });
    }else{
      this.toastrService.message(result.message,"User Creation Failed",{
        toasterMessageType: ToastrMessageType.Error,
        position:ToastrPosition.TopRight

      });
    } 
  }
}

