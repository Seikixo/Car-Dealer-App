import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarsService } from '../../services/cars.service';
import { Router } from '@angular/router';
import { Cars } from '../../interface/cars';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private carsService: CarsService,
    private router: Router
  ){
    this.form = this.formBuilder.group({
      make: ['', Validators.required],
      description: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  submitDetails(){
    if(this.form.valid){
      this.carsService.createCars(this.form.getRawValue()).subscribe(response =>{
      this.form.reset();
      })
    }
  }


}
