import { Component } from '@angular/core';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  template: `<div class="not-authorized"><h2>401 - Not Authorized</h2></div>`,
  styles: [`.not-authorized { text-align: center; margin-top: 3rem; color: #e57373; }`]
})
export class NotAuthorizedComponent {}
