import { Component, OnInit } from '@angular/core';
import { Cars } from 'src/app/interface/cars';
import { CarsService } from 'src/app/services/cars.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
  cars: Cars[] = [];
  filteredCars: Cars[] = []; 
  paginatedCars: Cars[] = []; 
  currentPage = 1;
  itemsPerPage = 5;

  showUpdateForm: boolean = false;
  selectedCar: Cars | null = null;

  form: FormGroup;

  filter = {
    make: '',
    model: '',
    year: null,
    minPrice: null,
    maxPrice: null
  };

  constructor(
    private carsService: CarsService, 
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.filteredCars = this.cars;
    this.form = formBuilder.group({
      make: ['', Validators.required],
      description: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllCars();
  }

  loadAllCars() {
    this.carsService.loadCars().subscribe(cars => {
      this.cars = cars;
      this.filteredCars = cars; 
      this.updatePaginatedCars(); 
    });
  }

  updatePaginatedCars() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedCars = this.filteredCars.slice(startIndex, startIndex + this.itemsPerPage);
  }

  filterCars() {
    this.filteredCars = this.cars.filter(car => {
      return (
        (this.filter.make ? car.make.toLowerCase().includes(this.filter.make.toLowerCase()) : true) &&
        (this.filter.model ? car.model.toLowerCase().includes(this.filter.model.toLowerCase()) : true) &&
        (this.filter.year ? car.year === this.filter.year : true) &&
        (this.filter.minPrice !== null ? +car.price >= this.filter.minPrice : true) && 
        (this.filter.maxPrice !== null ? +car.price <= this.filter.maxPrice : true)   
      );
    });
    this.currentPage = 1; 
    this.updatePaginatedCars(); 
  }
  

  deleteCar(carId: number) {
    this.carsService.deleteCar(carId).subscribe({
      next: (response) => {
        this.cars = this.cars.filter(car => car.id !== carId);
        this.loadAllCars();
      },
      error: (error) => {
        alert('Failed to delete: ' + error.message);
      }
    });
  }

  toggleUpdateCar(car: Cars) {
    this.selectedCar = { ...car };
    this.form.patchValue(car);
    this.showUpdateForm = true;
  }

  saveUpdateCar() {
    if (this.selectedCar && this.form.valid) {
      const updateCar = { ...this.selectedCar, ...this.form.getRawValue() };
      this.carsService.updateCar(this.selectedCar.id, updateCar).subscribe({
        next: () => {
          this.loadAllCars();
          this.showUpdateForm = false;
          this.selectedCar = null;
        },
        error: (error) => {
          alert('Failed to update car: ' + error.message);
        }
      });
    }
  }

  cancelUpdateCar() {
    this.showUpdateForm = false;
    this.selectedCar = null;
  }

  totalPages() {
    return Math.ceil(this.cars.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updatePaginatedCars();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCars();
    }
  }
}