import { Component, HostListener, OnInit } from '@angular/core';

import { OrdersService } from 'src/app/services/orders.service';

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

  @HostListener('window:resize')
  getScreenSize() {
    this.scrWidth = window.innerWidth
  }

  constructor(
    private orderService: OrdersService,
  ) { this.getScreenSize() }

  ngOnInit() {
    this.listenPedidos()
  }

  listenPedidos() {
    this.orderService.orders_subject.subscribe(orders => this.orders = orders)
  }

  seeOrder(order: Order) {
    this.order = order
  }

    // Tracks

    trackOrders(index: number, el: Order): string {
      return el.id
    }

}
