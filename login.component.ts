import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpservicesService } from '../services/httpservices.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  role: any;
  constructor(
    public http: HttpservicesService,
    public router: Router,
    public snack: MatSnackBar
  ) {}
  // isAdmin: any;
  forms: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onsubmit() {
    const obj = this.forms.value;
    // console.log(obj);
    this.http.login(obj).subscribe((data: any) => {
      // console.log(data.rows[0]);
      console.log(data);
      if (data.success) {
        // this.isAdmin = data.rows[0].a_roles == 'admin';/
        this.role = data.rows[0].r_name;
        const login = {
          role: this.role,
          username: data.rows[0].u_name,
          u_id: data.rows[0].u_id,
        };
        localStorage.setItem('loginDetails', JSON.stringify(login));

        this.router.navigateByUrl('home');
      } else {
        this.snack.open(data.message, 'ok', {
          duration: 2000,
        });
      }
      // console.log(this.isAdmin);
    });
  }
}
