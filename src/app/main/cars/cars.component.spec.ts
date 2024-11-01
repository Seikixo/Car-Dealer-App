import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarsComponent } from './cars.component';
import { CarsService } from 'src/app/services/cars.service';
import { of } from 'rxjs';
import { DialogsService } from 'src/app/services/dialogs.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

describe('CarsComponent', () => {
  let component: CarsComponent;
  let fixture: ComponentFixture<CarsComponent>;
  let carsService: CarsService;
  let dialogsService: DialogsService;

  beforeEach(() => {
    const carsServiceMock = {
      loadCars: jest.fn(),
      deleteCar: jest.fn(),
      updateCar: jest.fn(),
    };

    const dialogsServiceMock = {
      openSuccessDialog: jest.fn(),
      openErrorDialog: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [CarsComponent],
      providers: [
        { provide: CarsService, useValue: carsServiceMock },
        { provide: DialogsService, useValue: dialogsServiceMock },
        { provide: Router, useValue: {} } // Mock Router if needed
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CarsComponent);
    component = fixture.componentInstance;
    carsService = TestBed.inject(CarsService);
    dialogsService = TestBed.inject(DialogsService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load all cars on init', () => {
    const mockCars = [
      { id: 1, make: 'Toyota', model: 'Corolla', year: 2021, price: 20000, description: 'A reliable car.' },
      { id: 2, make: 'Honda', model: 'Civic', year: 2020, price: 22000, description: 'A fuel-efficient car.' }
    ];
    (carsService.loadCars as jest.Mock).mockReturnValue(of(mockCars));

    component.ngOnInit();

    expect(component.cars).toEqual(mockCars);
    expect(component.filteredCars).toEqual(mockCars);
    expect(component.paginatedCars).toEqual(mockCars);
  });

  it('should paginate cars correctly', () => {
    const mockCars = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      make: `Car ${i + 1}`,
      model: 'Model',
      year: 2021,
      price: 20000,
      description: `Description for Car ${i + 1}`
    }));
    
    component.cars = mockCars;
    component.filteredCars = mockCars;  // Ensure filteredCars is populated
    component.currentPage = 1;
    component.itemsPerPage = 5;
  
    component.updatePaginatedCars();
  
    expect(component.paginatedCars.length).toBe(5); // First page should show 5 cars
  });
  

  it('should filter cars correctly', () => {
    const mockCars = [
      { id: 1, make: 'Toyota', model: 'Corolla', year: 2021, price: 20000, description: 'A reliable car.' },
      { id: 2, make: 'Honda', model: 'Civic', year: 2020, price: 22000, description: 'A fuel-efficient car.' },
      { id: 3, make: 'Ford', model: 'Focus', year: 2021, price: 25000, description: 'A compact car.' }
    ];
    
    component.cars = mockCars;
    component.filter.make = 'Honda';
    component.filterCars();

    expect(component.filteredCars.length).toBe(1);
    expect(component.filteredCars[0].make).toBe('Honda');
  });

  it('should handle error on car deletion', () => {
    const mockCars = [
      { id: 1, make: 'Toyota', model: 'Corolla', year: 2021, price: 20000, description: 'A reliable car.' }
    ];
    component.cars = mockCars;
  
    // Simulate an error response from deleteCar
    (carsService.deleteCar as jest.Mock).mockReturnValue(throwError(() => new Error('Deletion error')));
  
    component.deleteCar(1);
  
    expect(dialogsService.openErrorDialog).toHaveBeenCalled();
  });

  it('should update a car', () => {
    const mockCar = { id: 1, make: 'Toyota', model: 'Corolla', year: 2021, price: 20000, description: 'A reliable car.' };
    const updatedCar = { id: 1, make: 'Toyota', model: 'Corolla', year: 2021, price: 21000, description: 'Updated description.' };
    
    (carsService.updateCar as jest.Mock).mockReturnValue(of({})); // Mock update service response

    component.selectedCar = mockCar;
    component.form.patchValue(updatedCar);
    component.saveUpdateCar();

    expect(dialogsService.openSuccessDialog).toHaveBeenCalledWith('Car update successful');
  });
  
  it('should handle error on car deletion', () => {
    const mockCars = [
      { id: 1, make: 'Toyota', model: 'Corolla', year: 2021, price: 20000, description: 'A reliable car.' }
    ];
    component.cars = mockCars;

    (carsService.deleteCar as jest.Mock).mockReturnValue(of({ error: 'Deletion error' })); // Mock error response

    component.deleteCar(1);

    expect(dialogsService.openErrorDialog).toHaveBeenCalled();
  });

  it('should handle error on car update', () => {
    const mockCar = { id: 1, make: 'Toyota', model: 'Corolla', year: 2021, price: 20000, description: 'A reliable car.' };

    (carsService.updateCar as jest.Mock).mockReturnValue(of({ error: 'Update error' })); // Mock error response

    component.selectedCar = mockCar;
    component.form.patchValue(mockCar);
    component.saveUpdateCar();

    expect(dialogsService.openErrorDialog).toHaveBeenCalled();
  });
});
