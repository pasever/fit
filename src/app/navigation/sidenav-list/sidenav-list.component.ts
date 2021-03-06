import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from "rxjs/Observable";

import { AuthService } from "../../auth/auth.service";
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  @Output() onCloseSidenav = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor( private authService: AuthService, private store: Store<fromRoot.State>) { }

  ngOnInit() {
      this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onLogout() {
      this.authService.logout();
      this.onClose();
  }

  onClose() {
      this.onCloseSidenav.emit();
  }

}
