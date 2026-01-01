import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {
  properties: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loading = true;
    this.api.get<any[]>('/properties').subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load properties';
        this.loading = false;
      }
    });
  }
}
