import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlDirective, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { User } from 'src/app/entities/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  constructor(private formBuilder:FormBuilder) { }

  frm: FormGroup;
  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['',[Validators.required, Validators.minLength(8)]],
      confirmPassword: ['',[Validators.required,]]
    }, { validator: (group: FormGroup): ValidationErrors | null =>{
          const pass = group.get('password').value;
          const confirmPass = group.get('confirmPassword').value;
          return pass === confirmPass ? null : { notSame: true }

          }
      });

      

      this.frm.valueChanges.subscribe(() => {
        Object.keys(this.frm.controls).forEach(key => {
          const controlErrors: ValidationErrors = this.frm.get(key).errors;
          if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            });
          }
        });
      }); 
  }

  
  get component() { return this.frm.controls; }

  submitted: boolean = false;
  onSubmit(data:User){
    this.submitted = true;
    if(this.frm.invalid) return;
    
    var f = this.frm;
    var c = this.component;

    debugger;

  } 
} 

