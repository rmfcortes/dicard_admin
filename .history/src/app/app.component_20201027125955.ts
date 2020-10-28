import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService } from './services/language.service';
import { OrdersService } from './services/orders.service';
import { AuthService } from './services/auth.service';
import { UidService } from './services/uid.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  home =  {
    title: 'MENU.home',
    url: '/home',
    icon: 'home'
  }

  maps = {
    title: 'MENU.maps',
    url: '/maps',
    icon: 'location'
  }

  products = {
    title: 'MENU.products',
    url: '/products',
    icon: 'book'
  }

  services = {
    title: 'Servicios',
    url: '/products',
    icon: 'book'
  }

  orders_menu = {
    title: 'MENU.orders',
    url: '/orders',
    icon: 'cart'
  }

  agenda_menu = {
    title: 'Citas',
    url: '/orders',
    icon: 'book'
  }

  historial = {
    title: 'Historial',
    url: '/historial',
    icon: 'file-tray-stacked'
  }

  public appPages = []

  orders = 0
  name = ''

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
    this.orderService.isRestricted()
    this.isRestricted()
  }

  isRestricted() {
    this.orderService.restricted_subject.subscribe(res => {
      console.log(res);
      this.appPages = []
      if (!res) this.getProfile()
      else {
        this.name = this.profileService.getName()
        this.router.navigate(['/orders'], {replaceUrl: true})
        this.appPages.push(this.orders_menu)
        this.orderService.listenOrdersRestricted(res.master, res.coverage)
        this.listenOrders()
      }
    })
  }

  getProfile() {
    this.profileService.profile_sub.subscribe(profile => {
      console.log(profile);
      console.log(this.profileService.getProfileEmpty());
      if (this.profileService.getProfileEmpty()) return
      this.appPages = []
      if (!profile) return
      this.name = this.profileService.getName()

      if (profile && profile.type === 'products') {
        this.appPages.push(this.orders_menu)
        this.appPages.push(this.historial)
        this.appPages.push(this.products)
        this.appPages.push(this.home)
        this.appPages.push(this.maps)
        this.orderService.listenOrders()
        this.listenOrders()
      }

      if (profile && profile.type === 'services') {
        this.appPages.push(this.agenda_menu)
        this.appPages.push(this.historial)
        this.appPages.push(this.services)
        this.appPages.push(this.home)
        this.appPages.push(this.maps)
        this.orderService.listenOrders()
        this.listenOrders()
      }

      if (!profile.type) {
        this.appPages.push(this.products)
        this.appPages.push(this.home)
        this.appPages.push(this.maps)
      }
      console.log(this.appPages);
    })
  }

  listenOrders() {
    this.orderService.orders_subject.subscribe(orders => {
      if (orders.length > this.orders) this.playNotification()
      this.orders = orders.length
    })
  }

  playNotification() {
    const audio = new Audio()
    audio.src = '../assets/sound/notification.mp3'
    audio.play()
  }

  logOut() {
    this.orderService.stopListen()
    setTimeout(() => {
      this.authService.logout()
      this.router.navigate(['/login'], {replaceUrl: true})
    }, 350)
  }

}
