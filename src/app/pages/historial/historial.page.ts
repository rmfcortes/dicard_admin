import { Component, HostListener, OnInit } from '@angular/core';

import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';

import { MainProfile } from 'src/app/interfaces/profile.interface';
import { Order } from 'src/app/interfaces/cart.interface';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  historial: Order[] = []
  order: Order

  profile: MainProfile

  hideMainCol = false
  scrWidth: number

  @HostListener('window:resize')
  getScreenSize() {
    this.scrWidth = window.innerWidth
  }

  constructor(
    private orderService: OrdersService,
    private userService: UserService,
  ) { this.getScreenSize() }

  ngOnInit() {
    this.getProfile()
  }

  getProfile() {
    this.userService.getProfile()
    .then(async (profile) => {
      this.profile = profile
      this.getHistorial()
    })
  }

  getHistorial() {
    this.orderService.getHistorial().then(historial => {
      this.historial = historial
      this.historial.sort((a, b) => b.createdAt - a.createdAt)
    })
  }

  seeOrder(order: Order) {
    this.order = order
    this.hideMainCol = true
  }

  regresar() {
    this.order = null
    this.hideMainCol = false
  }

}
