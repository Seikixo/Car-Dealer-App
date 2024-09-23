import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarsService } from '../../services/cars.service';
import { Router } from '@angular/router';
import { Cars } from '../../interface/cars';
import { DialogsService } from 'src/app/services/dialogs.service';

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
    private dialogService: DialogsService,
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
      this.dialogService.openSuccessDialog('The car is registered successfully');
      this.form.reset();
      })
    }
  }


}
