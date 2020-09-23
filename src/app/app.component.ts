import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService } from './services/language.service';
import { AuthService } from './services/auth.service';
import { OrdersService } from './services/orders.service';
import { UserService } from './services/user.service';
import { UidService } from './services/uid.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

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
  ]

  orders = 0

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private orderService: OrdersService,
    private profileService: UidService,
    private authService: AuthService,
  ) {
    this.languageService.getDefaultLanguage()
  }

  ngOnInit() {
    this.getProfile()
  }

  getProfile() {
    this.profileService.profile_sub.subscribe(profile => {
      if (profile && profile.type === 'products') {
        this.appPages.unshift(
          {
            title: 'MENU.orders',
            url: '/orders',
            icon: 'cart'
          }
        )
        this.appPages.push(
          {
            title: 'Historial',
            url: '/historial',
            icon: 'file-tray-stacked'
          }
        )
        this.orderService.listenOrders()
        this.listenOrders()
      }
    })
  }

  listenOrders() {
    this.orderService.orders_subject.subscribe(orders => this.orders = orders.length)
  }


  logOut() {
    this.orderService.stopListen()
    setTimeout(() => {
      this.authService.logout()
      this.router.navigate(['/login'], {replaceUrl: true})
    }, 350)
  }

}
