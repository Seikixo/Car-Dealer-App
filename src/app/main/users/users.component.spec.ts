import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { User } from 'src/app/interface/user';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userService: UserService; // Use the actual type here

  const mockUsers: User[] = [
    { id: 1, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', password: 'password123', isActive: 1 },
    { id: 2, firstname: 'Jane', lastname: 'Smith', email: 'jane.smith@example.com', password: 'password456', isActive: 1 },
  ];

  beforeEach(() => {
    // Create a mock UserService
    userService = {
      loadUsers: jest.fn().mockReturnValue(of(mockUsers)), // Jest mock implementation
    } as unknown as UserService; // Cast as UserService

    TestBed.configureTestingModule({
      declarations: [UsersComponent],
      providers: [
        { provide: UserService, useValue: userService }
      ]
    });

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges(); // Run change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    component.ngOnInit();
    expect(userService.loadUsers).toHaveBeenCalled(); // Ensure loadUsers was called
    expect(component.users.length).toBe(mockUsers.length); // Ensure the users are loaded
    expect(component.users).toEqual(mockUsers); // Ensure the loaded users match mockUsers
  });

  it('should display user information in the template', () => {
    // Trigger change detection to update the template
    fixture.detectChanges();

    // Get the elements to check their content
    const userElements = fixture.nativeElement.querySelectorAll('.users-field');
    
    expect(userElements.length).toBe(mockUsers.length); // Check number of displayed users

    mockUsers.forEach((user, index) => {
      expect(userElements[index].querySelector('.output').textContent).toContain(user.id.toString());
      expect(userElements[index].querySelectorAll('.output')[1].textContent).toContain(user.firstname);
      expect(userElements[index].querySelectorAll('.output')[2].textContent).toContain(user.lastname);
      expect(userElements[index].querySelectorAll('.output')[3].textContent).toContain(user.email);
    });
  });
});
