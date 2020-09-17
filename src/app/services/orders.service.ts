import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { UidService } from './uid.service';

import { Order } from '../interfaces/cart.interface';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  orders: Order[] = []
  orders_subject = new BehaviorSubject<Order[]>(this.orders)

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  listenOrders() {
    const uid = this.uidService.getUid()
    const auth = this.uidService.getAuthChecked()
    if (!uid || !auth) return setTimeout(() => this.listenOrders(), 100)
    this.db.list(`orders/${uid}`).valueChanges().subscribe((orders: Order[]) => {
      this.orders = orders
      this.orders_subject.next(this.orders)
    })
  }

}
