import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCarComponent } from './add-car.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CarsService } from '../../services/cars.service';
import { of } from 'rxjs';
import { DialogsService } from 'src/app/services/dialogs.service';
import { Router } from '@angular/router';

describe('AddCarComponent', () => {
  let component: AddCarComponent;
  let fixture: ComponentFixture<AddCarComponent>;
  let carsService: jasmine.SpyObj<CarsService>;
  let dialogService: jasmine.SpyObj<DialogsService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spy objects for the services
    carsService = jasmine.createSpyObj('CarsService', ['createCars']);
    dialogService = jasmine.createSpyObj('DialogsService', ['openSuccessDialog']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [AddCarComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CarsService, useValue: carsService },
        { provide: DialogsService, useValue: dialogService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // Run change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled', () => {
    component.form.setValue({
      make: 'Toyota',
      description: 'A reliable car',
      model: 'Camry',
      year: '2020',
      price: '25000'
    });

    expect(component.form.valid).toBeTruthy();
  });

  it('should submit form and call createCars service method when form is valid', () => {
    component.form.setValue({
      make: 'Toyota',
      description: 'A reliable car',
      model: 'Camry',
      year: '2020',
      price: '25000'
    });

    carsService.createCars.and.returnValue(of({})); // Mock the service response

    component.submitDetails();

    expect(carsService.createCars).toHaveBeenCalledWith(component.form.getRawValue());
    expect(dialogService.openSuccessDialog).toHaveBeenCalledWith('The car is registered successfully');
    expect(component.form.valid).toBeTruthy();
  });

  it('should not submit form and not call createCars if form is invalid', () => {
    component.form.setValue({
      make: '',
      description: '',
      model: '',
      year: '',
      price: ''
    });

    component.submitDetails();

    expect(carsService.createCars).not.toHaveBeenCalled(); // Expect service method not to be called
  });

  it('should reset the form after successful submission', () => {
    component.form.setValue({
      make: 'Toyota',
      description: 'A reliable car',
      model: 'Camry',
      year: '2020',
      price: '25000'
    });

    carsService.createCars.and.returnValue(of({})); // Mock the service response

    component.submitDetails();

    expect(component.form.value).toEqual({
      make: '',
      description: '',
      model: '',
      year: '',
      price: ''
    });
  });
});
