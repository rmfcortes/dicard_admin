import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService } from './services/language.service';
import { AuthService } from './services/auth.service';
import { OrdersService } from './services/orders.service';

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
      title: 'MENU.orders',
      url: '/orders',
      icon: 'cart'
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
    private authService: AuthService,
  ) {
    this.languageService.getDefaultLanguage()
  }

  ngOnInit() {
    this.orderService.listenOrders()
    this.listenOrders()
  }

  listenOrders() {
    this.orderService.orders_subject.subscribe(orders => this.orders = orders.length)
  }


  logOut() {
    this.authService.logout()
    this.router.navigate(['/login'], {replaceUrl: true})
  }

}
