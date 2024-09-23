import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { DialogsService } from '../services/dialogs.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dialogService: DialogsService,
    private router: Router
  ){
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submitCredentials(){
    const emailControl = this.form.get('email');

    if(this.form.invalid && emailControl?.value === ''){
      this.dialogService.openErrorDialog('Please fill in all credentials');
      return;
    }

    if(emailControl && emailControl.invalid){
      this.dialogService.openErrorDialog('Invalid Email please try again');
      return;
    }
    else{
    this.userService.loginUser(this.form.getRawValue()).subscribe({
        next: (response: any) =>{
          if(response.success){
            localStorage.setItem('token', response.accessToken);
            this.router.navigateByUrl('/main');
          }
        },
        error: (error) =>{
          this.dialogService.openErrorDialog('Invalid User please try again');
          return;
        }
      }
    );
    }
  }

  navigateRegister(){
    this.router.navigateByUrl('/register');
  }

}
