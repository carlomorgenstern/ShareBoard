import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { faBars, faCaretDown, faHome, faLongArrowAltDown, faLongArrowAltUp, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { LocalStorage } from 'ngx-webstorage';

import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  faArrowDown = faLongArrowAltDown;
  faArrowUp = faLongArrowAltUp;
  faBars = faBars;
  faCaretDown = faCaretDown;
  faHome = faHome;
  faSignOut = faSignOutAlt;
  faUser = faUser;

  navbarCollapsed = true;
  userCollapsed = true;

  @LocalStorage('sb-navbar-top', true)
  isNavTop = true;

  isLoggedIn = false;
  userName = '';

  constructor (private readonly authService: AuthenticationService, private readonly router: Router, private readonly titleService: Title) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user === undefined) {
        this.isLoggedIn = false;
        this.userName = '';
      } else {
        this.isLoggedIn = true;
        this.userName = user.displayName;
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        if (typeof event.snapshot.data.title === 'string') {
          this.titleService.setTitle(event.snapshot.data.title + ' | ShareBoard');
        } else {
          this.titleService.setTitle('ShareBoard');
        }
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe(async () => {
      await this.router.navigate(['/login']);
    });
  }
}
