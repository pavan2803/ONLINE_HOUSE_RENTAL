import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amenity-icon',
  standalone: true,
  template: `<mat-icon>{{icon}}</mat-icon>`,
  styles: [`mat-icon { font-size: 1.5rem; margin-right: 0.25rem; }`]
})
export class AmenityIconComponent {
  @Input() icon: string = '';
}
