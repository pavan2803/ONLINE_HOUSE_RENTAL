import { Component, Input } from '@angular/core';
import { AuthService, User } from '../../core/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  @Input() user: User | null = null;
  constructor(public auth: AuthService) {}
}
