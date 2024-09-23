import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { DialogsService } from '../services/dialogs.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dialogService: DialogsService,
    private router: Router
  ){
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      isActive: [1, Validators.required]
    })
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
      this.userService.registerUser(this.form.getRawValue()).subscribe({
        next: (response) =>{
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          alert('Registration failed please try again');
        }
      }
    );
    }
  }

  navigateLogin(){
    this.router.navigateByUrl('/login');
  }

}
