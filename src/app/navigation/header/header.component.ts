import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { Store } from '@ngrx/store';
import { Observable } from "rxjs/Observable";

import * as fromRoot from '../../app.reducer';
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth$: Observable<boolean>;
  authSubscription: Subscription;

  constructor( private store: Store<fromRoot.State>, private authService: AuthService ) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

}
