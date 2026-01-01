import { Component } from '@angular/core';

@Component({
  selector: 'app-property-details',
  standalone: true,
  template: `<div class="property-details"><h2>Property Details</h2><p>Property details will be shown here.</p></div>`,
  styles: [`.property-details { padding: 2rem; }`]
})
export class PropertyDetailsComponent {}
