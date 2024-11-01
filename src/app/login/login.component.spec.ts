import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { DialogsService } from '../services/dialogs.service';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';

class MockUserService {
  loginUser = jest.fn(); // Declare as a Jest mock function
}

class MockDialogsService {
  openErrorDialog = jest.fn(); // Mock openErrorDialog method
}

class MockRouter {
  navigateByUrl = jest.fn(); // Mock navigateByUrl method
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserService;
  let dialogService: DialogsService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], // Import ReactiveFormsModule for form testing
      declarations: [LoginComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: DialogsService, useClass: MockDialogsService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    dialogService = TestBed.inject(DialogsService);
    router = TestBed.inject(Router);
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.controls['email']).toBeTruthy();
    expect(component.form.controls['password']).toBeTruthy();
  });

  it('should show an error dialog if the form is invalid and the email is empty', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');

    component.submitCredentials();

    expect(dialogService.openErrorDialog).toHaveBeenCalledWith('Please fill in all credentials');
  });

  it('should show an error dialog if the email is invalid', () => {
    component.form.controls['email'].setValue('invalid-email');
    component.form.controls['password'].setValue('password');

    component.submitCredentials();

    expect(dialogService.openErrorDialog).toHaveBeenCalledWith('Invalid Email please try again');
  });

  it('should navigate to /main on successful login', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password');

    // Mock the userService to return a successful login response
    (userService.loginUser as jest.Mock).mockReturnValue(of({ success: true, accessToken: 'dummyToken' }));

    component.submitCredentials();

    expect(localStorage.getItem('token')).toBe('dummyToken');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/main');
  });

  it('should show an error dialog on login failure', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password');

    // Mock the userService to return an error response
    (userService.loginUser as jest.Mock).mockReturnValue(throwError(() => new Error('Login failed')));

    component.submitCredentials();

    expect(dialogService.openErrorDialog).toHaveBeenCalledWith('Invalid User please try again');
  });

  it('should navigate to /register when navigateRegister is called', () => {
    component.navigateRegister();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/register');
  });
});
