import { Component, Input } from '@angular/core';
import { AuthService, User } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() user: User | null = null;
  constructor(public auth: AuthService) {}
}
