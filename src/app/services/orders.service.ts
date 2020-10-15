import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';

import { UidService } from './uid.service';

import { Order } from '../interfaces/cart.interface';
import { Restricted } from '../interfaces/profile.interface';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  orders: Order[] = []
  orders_subject = new BehaviorSubject<Order[]>(this.orders)
  restricted_subject = new BehaviorSubject<Restricted>(null)

  orderSub: Subscription

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  isRestricted() {
    const uid = this.uidService.getUid()
    const auth = this.uidService.getAuthChecked()
    if (!uid || !auth) return setTimeout(() => this.isRestricted(), 100)
    const resSub = this.db.object(`restrict/${uid}`).valueChanges().subscribe((res: Restricted) => {
      resSub.unsubscribe()
      this.restricted_subject.next(res)
    })
  }

  listenOrdersRestricted(uid: string, branchs: string[]) {
    this.orderSub = this.db.list(`orders/${uid}`).valueChanges().subscribe((orders: Order[]) => {
      this.orders = []
      for (const branch of branchs) {
        const fil = orders.filter(o => o.branch.name === branch)
        this.orders = this.orders.concat(fil)
      }
      this.orders_subject.next(this.orders)
    })
  }

  listenOrders() {
    const uid = this.uidService.getUid()
    const auth = this.uidService.getAuthChecked()
    if (!uid || !auth) return setTimeout(() => this.listenOrders(), 100)
    this.orderSub = this.db.list(`orders/${uid}`).valueChanges().subscribe((orders: Order[]) => {
      this.orders = orders
      this.orders_subject.next(this.orders)
    })
  }

  async complete(order: Order) {
    const uid = this.uidService.getUid()
    await this.db.object(`principal/${uid}/historial/${order.id}`).set(order)
    this.db.object(`orders/${uid}/${order.id}`).remove()
  }

  getHistorial(): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid()
      const hisSub = this.db.list(`principal/${uid}/historial`).valueChanges().subscribe((historial: Order[]) => {
        hisSub.unsubscribe()
        resolve(historial)
      })
    })
  }

  stopListen() {
    if (this.orderSub) this.orderSub.unsubscribe()
  }

}
