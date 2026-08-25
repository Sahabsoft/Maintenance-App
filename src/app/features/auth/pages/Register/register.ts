import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { CreateUser } from './models/CreateUser.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './register.scss',
})
export class Register {
  constructor(private auth: Auth) {}
  createUser: CreateUser = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  };

  submit() {
    this.auth.Register(this.createUser);
  }
}
