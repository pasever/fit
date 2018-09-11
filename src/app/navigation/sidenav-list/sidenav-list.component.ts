import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  @Output() onCloseSidenav = new EventEmitter<void>();

  constructor( private authService: AuthService) { }

  ngOnInit() {
  }

  onLogout() {
      this.authService.logout();
      this.onClose();
  }

  onClose() {
      this.onCloseSidenav.emit();
  }

}
