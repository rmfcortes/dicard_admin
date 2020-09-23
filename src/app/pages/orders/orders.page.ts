import { Component, HostListener, OnInit } from '@angular/core';

import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';

import { MainProfile } from 'src/app/interfaces/profile.interface';
import { Order } from 'src/app/interfaces/cart.interface';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  

  orders: Order[] = []
  order: Order

  scrWidth: number
  hideMainCol = false

  profile: MainProfile

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
      this.listenPedidos()
    })
  }

  listenPedidos() {
    this.orderService.orders_subject.subscribe(orders => {
      this.orders = orders
      this.orders.sort((a, b) => b.createdAt - a.createdAt)
    })
  }

  seeOrder(order: Order) {
    this.order = order
    this.hideMainCol = true
  }

  complete() {
    this.orderService.complete(this.order)
    this.regresar()
  }

  regresar() {
    this.order = null
    this.hideMainCol = false
  }

  // Tracks

  trackOrders(index: number, el: Order): string {
    return el.id
  }

}
