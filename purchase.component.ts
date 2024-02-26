import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { HttpservicesService } from '../services/httpservices.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import e from 'cors';
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css',
})
export class PurchaseComponent {
  role = JSON.parse(localStorage.getItem('loginDetails') || '{}');
  isManager = this.role.role == 'Manager-ACC';

  dataSource: any;

  constructor(
    public httpservice: HttpservicesService,
    public dialog: MatDialog
  ) {
    this.getPurchase();
  }
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // ITEMSSSSSS---------

  getPurchase() {
    this.httpservice.getPurchase().subscribe((data: any) => {
      if (!this.isManager) {
        const curruser = data.rows.filter(
          (el: any) => el.u_name == this.role.username
        );

        this.dataSource = new MatTableDataSource<any>(curruser);
      } else {
        this.dataSource = new MatTableDataSource<any>(data.rows);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  displayedColumns: string[] = [
    'pu_id',
    'pu_number',
    'pu_date',
    'p_name',
    'v_name',
    'pu_beforedate',
    'u_name',
    'actions',
    'action',
  ];

  displayed: string[] = [
    'pu_number',
    'i_name',
    'i_type',
    'quantity',
    'i_discount',
    'i_uom',
  ];
  source: any;
  getTable() {}

  submitTo(event: any) {
    const obj = { pu_id: event };
    this.httpservice.getLineItems(obj).subscribe((data: any) => {
      this.source = data.rows;
    });
  }
  setFilter(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.dataSource.filter = value;
    console.log(value);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddPurchaseComponent);
    dialogRef.afterClosed().subscribe((result) => {
      this.getPurchase();
    });
  }
  openLine(): void {
    const dialogRef = this.dialog.open(AddLineComponent);
    dialogRef.afterClosed().subscribe((result) => {
      this.getPurchase();
    });
  }
}
@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrl: './purchase.component.css',
})
export class AddPurchaseComponent {
  // userDetails =
  minDate: any;
  userDetails = JSON.parse(localStorage.getItem('loginDetails') || '{}');
  allPlants: any = [];
  allVentors: any = [];
  constructor(
    public dialogRef: MatDialogRef<AddPurchaseComponent>,
    public httpser: HttpservicesService
  ) {
    this.getPlants();
    this.getVentors();
    this.minDate = new Date();
  }
  // alldepartments: any = [];

  myforms: FormGroup = new FormGroup({
    p_id: new FormControl('', [Validators.required]),
    v_id: new FormControl('', [Validators.required]),
    pu_beforedate: new FormControl('', [Validators.required]),
    u_id: new FormControl(this.userDetails.u_id),
    // pu_beforedate:new FormControl("",[Validators.required])
  });
  addRoles() {
    const obj = this.myforms.value;
    console.log(obj);
    this.httpser.addPurchase(obj).subscribe((data: any) => {
      if (data.success) {
        this.dialogRef.close();
      }
    });
  }
  getPlants() {
    this.httpser.getPlants().subscribe((datta: any) => {
      this.allPlants = datta.rows;
    });
  }
  getVentors() {
    this.httpser.getVentors().subscribe((datta: any) => {
      this.allVentors = datta.rows;
    });
  }
  onClose() {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'app-add-line',
  templateUrl: './add-line.component.html',
  styleUrl: './purchase.component.css',
})
export class AddLineComponent {
  // dataSource:any;
  elements: any = [];
  dataSource: any = [];

  allPurchase: any;
  allItems: any;
  constructor(
    public dialogRef: MatDialogRef<AddPurchaseComponent>,
    public httpser: HttpservicesService
  ) {
    this.getPurchase();
    this.getItems();
  }
  // alldepartments: any = [];

  myforms: FormGroup = new FormGroup({
    pu_id: new FormControl('', [Validators.required]),
    i_id: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),

    // pu_beforedate:new FormControl("",[Validators.required])
  });
  // addRoles() {
  //   const obj = this.myforms.value;
  //   console.log(obj);
  //   this.httpser.addPurchase(obj).subscribe((data: any) => {
  //     if (data.success) {
  //       this.dialogRef.close();
  //     }
  //   });
  // }
  add(pu_id: any) {
    const obj = { pu_id };
    this.httpser.getLineItems(obj).subscribe((data: any) => {});
  }

  displayedColumns: string[] = ['items', 'quantity'];
  addTo() {
    const { pu_id, i_id, quantity } = this.myforms.value;
    if (!pu_id || !i_id || !quantity) return;

    this.dataSource.push(this.myforms.value);
    this.dataSource = [...this.dataSource];
  }
  submitTo(event: any) {
    // console.log(this.dataSource);
    this.httpser.addLineItems(this.dataSource).subscribe((data) => {});
  }
  getPurchase() {
    this.httpser.getPurchase().subscribe((datta: any) => {
      console.log(datta);
      this.allPurchase = datta.rows;
    });
  }
  getItems() {
    this.httpser.getItems().subscribe((datta: any) => {
      this.allItems = datta.rows;
    });
  }
  onClose() {
    this.dialogRef.close();
  }
}
