import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Observable} from 'rxjs';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import  * as carList  from './car.json';
import  * as carPart  from './car-parts.json';
import {map, startWith} from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


interface Cars{
  brand:string;
}

interface CarPart{
  'List-of-auto-parts':string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'car-registration';
  carsList: any = (carList as any).default;
  carPart: any = (carPart as any).default;
  selectedPart: string[] = [];
  @ViewChild('carPartRef',{static: false}) carPartRef: ElementRef<HTMLInputElement> | any;
  
  name: FormControl= new FormControl('',[Validators.required,Validators.maxLength(75),Validators.pattern('^[a-zA-Z]*$')]);
  cars: FormControl = new FormControl('', Validators.required);
  carParts: FormControl = new FormControl('',Validators.required);
  colorCar: FormControl = new FormControl('#000000',Validators.required);
  filteredOptions: Observable<Cars[]> | any = []
  filterCarParts: Observable<Cars[]> | any = []
  separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(){
    this.filterCarParts = this.carParts.valueChanges.pipe(
      startWith(null),
      map((fruit: any | null) => (fruit ? this._filterPart(fruit) : this.carPart.slice()))
    );
  }
  ngOnInit(): void {    
    this.filteredOptions = this.cars.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.brand)),
      map(name => (name ? this._filterCar(name) : this.carsList.slice())),
    );
  
  }


  private _filterCar(value: string): string[] {
   const filterValue = value.toLowerCase();
    return this.carsList.filter((option:any) => option.brand.toLowerCase().includes(filterValue));
  }

  private _filterPart(value: string): string[] {
   const filterValue = value.toLowerCase();
    return this.carPart.filter((option:any) => option['List-of-auto-parts'].toLowerCase().includes(filterValue));
  }

  displayFn(user: Cars): string {
    return user && user.brand ? user.brand : '';
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedPart.push(value);
    }
    event.chipInput!.clear();
    this.carParts.setValue(null);
  }

  remove(value: string): void {
    const index = this.selectedPart.indexOf(value);
    if (index >= 0) {
      this.selectedPart.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedPart.push(event.option.viewValue);
    this.carPartRef.nativeElement.value = '';
    this.carParts.setValue(null);
  }

  onSubmit(){
    console.log(this.name)
    console.log(this.carParts)
    console.log(this.colorCar)

  }
 

}
