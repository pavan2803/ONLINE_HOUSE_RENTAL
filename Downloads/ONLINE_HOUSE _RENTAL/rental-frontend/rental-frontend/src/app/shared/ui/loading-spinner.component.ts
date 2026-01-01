import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `<div class="loading-spinner"><mat-progress-spinner mode="indeterminate"></mat-progress-spinner></div>`,
  styles: [`.loading-spinner { display: flex; justify-content: center; align-items: center; height: 100px; }`]
})
export class LoadingSpinnerComponent {}
