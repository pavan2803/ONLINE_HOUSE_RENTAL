import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-property',
  standalone: true,
  template: `<div class="manage-property"><h2>Manage Property</h2><p>Property management form will appear here.</p></div>`,
  styles: [`.manage-property { padding: 2rem; }`]
})
export class ManagePropertyComponent {}
