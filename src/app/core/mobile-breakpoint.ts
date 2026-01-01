import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileBreakpointService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  isMobile$(): Observable<boolean> {
    return this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches)
    );
  }
}
