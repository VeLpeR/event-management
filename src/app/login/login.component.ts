import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router:Router) {}

  onLogin() {
    this.loginService.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/dashboard']);
          localStorage.setItem("token",response.token)
          // TODO: Handle successful login (e.g., redirect, store token)
        },
        error: (error) => {
          console.error('Login failed', error);
          // TODO: Handle login error (e.g., show error message)
        }
      });
  }
}
