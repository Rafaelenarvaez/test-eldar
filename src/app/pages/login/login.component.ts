import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthServiceService, private router: Router) { }

  onSubmit() {
    const result = this.authService.login(this.username, this.password);
    if (result.success) {
      if (result.role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (result.role === 'user') {
        this.router.navigate(['/home']);
      }
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
}