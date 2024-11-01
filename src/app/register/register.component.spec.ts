import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { DialogsService } from '../services/dialogs.service';
import { RegisterComponent } from './register.component';
import { of, throwError } from 'rxjs';

class MockUserService {
  registerUser = jest.fn(); // Declare as a Jest mock function
}

class MockDialogsService {
  openErrorDialog = jest.fn(); // Mock openErrorDialog method
  openSuccessDialog = jest.fn(); // Mock openSuccessDialog method
}

class MockRouter {
  navigateByUrl = jest.fn(); // Mock navigateByUrl method
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserService;
  let dialogService: DialogsService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], // Import ReactiveFormsModule for form testing
      declarations: [RegisterComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: DialogsService, useClass: MockDialogsService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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
    expect(component.form.controls['firstname']).toBeTruthy();
    expect(component.form.controls['lastname']).toBeTruthy();
  });

  it('should show an error dialog if the form is invalid and email is empty', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    component.form.controls['firstname'].setValue('');
    component.form.controls['lastname'].setValue('');

    component.submitCredentials();

    expect(dialogService.openErrorDialog).toHaveBeenCalledWith('Please fill in all credentials');
  });

  it('should show an error dialog if the email is invalid', () => {
    component.form.controls['email'].setValue('invalid-email');
    component.form.controls['password'].setValue('password');
    component.form.controls['firstname'].setValue('First');
    component.form.controls['lastname'].setValue('Last');

    component.submitCredentials();

    expect(dialogService.openErrorDialog).toHaveBeenCalledWith('Invalid Email please try again');
  });

  it('should show a success dialog and navigate to /login on successful registration', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password');
    component.form.controls['firstname'].setValue('First');
    component.form.controls['lastname'].setValue('Last');

    // Mock the userService to return a successful registration response
    (userService.registerUser as jest.Mock).mockReturnValue(of({}));

    component.submitCredentials();

    expect(dialogService.openSuccessDialog).toHaveBeenCalledWith('The user is registered successfully');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should show an error alert on registration failure', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password');
    component.form.controls['firstname'].setValue('First');
    component.form.controls['lastname'].setValue('Last');

    // Mock the userService to return an error response
    (userService.registerUser as jest.Mock).mockReturnValue(throwError(() => new Error('Registration failed')));

    // Spy on the global alert function
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.submitCredentials();

    expect(alertSpy).toHaveBeenCalledWith('Registration failed please try again');
    alertSpy.mockRestore(); // Restore the original alert function
  });

  it('should navigate to /login when navigateLogin is called', () => {
    component.navigateLogin();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
