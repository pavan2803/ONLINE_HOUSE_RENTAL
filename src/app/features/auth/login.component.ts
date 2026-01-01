import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="login()">
        <input [(ngModel)]="email" name="email" placeholder="Email" required />
        <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required />
        <select [(ngModel)]="role" name="role">
          <option value="tenant">Tenant</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Login</button>
      </form>
    </div>
  `,
  styles: [`.login-container { max-width: 350px; margin: 3rem auto; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px #eee; }`]
})
export class LoginComponent {
  email = '';
  password = '';
  role: 'tenant' | 'owner' | 'admin' = 'tenant';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    // Simulate login and JWT
    const user: User = {
      id: '1',
      email: this.email,
      role: this.role,
      token: 'mock-jwt-token',
    };
    this.auth.login(user);
    if (this.role === 'tenant') this.router.navigate(['/properties']);
    else if (this.role === 'owner') this.router.navigate(['/dashboard']);
    else this.router.navigate(['/admin']);
  }
}
