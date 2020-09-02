import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from './services/language.service';
import { AlertService } from './services/alert.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public appPages = [
    {
      title: 'MENU.home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'MENU.maps',
      url: '/maps',
      icon: 'location'
    },
    {
      title: 'MENU.products',
      url: '/products',
      icon: 'book'
    },
  ];


  constructor(
    private router: Router,
    private languageService: LanguageService,
    private authService: AuthService,
  ) {
    this.languageService.getDefaultLanguage()
  }



  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
