import { Component, HostListener, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { jsPDF, TextOptionsLight } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

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
  
  orderBranch: OrderBranch[] = []
  order: Order

  scrWidth: number
  hideMainCol = false

  profile: MainProfile

  logo: string

  @HostListener('window:resize')
  getScreenSize() {
    this.scrWidth = window.innerWidth
  }

  constructor(
    private menu: MenuController,
    private orderService: OrdersService,
    private userService: UserService,
  ) { this.getScreenSize() }

  ngOnInit() {
    this.isRestricted()
  }

  ionViewWillEnter() {
    this.menu.enable(true)
  }

  isRestricted() {
    this.orderService.restricted_subject.subscribe(async (res) => {
      this.orderBranch = []
      if (!res) this.getProfile()
      else {
        res.coverage.forEach(c => this.orderBranch.push({name: c, orders: []}))
        this.orderService.listenOrdersRestricted(res.master, res.coverage)
        this.listenPedidos()
        this.logo = await this.userService.getLogo(res.master)
      }
    })
  }

  getProfile() {
    this.userService.getProfile()
    .then(async (profile) => {
      if (!profile.name) return
      this.orderBranch = []
      this.profile = profile
      this.profile.address.forEach(a => this.orderBranch.push({name: a.name, orders: []}))
      this.logo = this.profile.photo
      this.listenPedidos()
    })
  }
  
  listenPedidos() {
    this.orderService.orders_subject.subscribe(orders => {
      orders.sort((a, b) => b.createdAt - a.createdAt)
      this.orderBranch.forEach(o => o.orders = orders.filter(or => or.branch.name === o.name))
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

  trackBracnOrders(index: number, el: OrderBranch): string {
    return el.name
  }

  trackOrders(index: number, el: Order): string {
    return el.id
  }

  // Ticket

  async downloadAsPDF() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'cm',
      format: [32, 8],
    })
    const options: TextOptionsLight = {
      align: 'center',
      maxWidth: 7,
    }
    
    doc.addImage(this.logo, 'JPEG', 1, 1, 6, 6)

    doc.setFontSize(18)
    doc.text(this.order.idTrack, 4, 8, options)
    doc.setFontSize(12)
    doc.text(this.order.createdAt.toLocaleString(), 4, 9, options)
    doc.text(this.order.branch.address, 4, 9.5, options)
    doc.setLineWidth(0.1)
    doc.line(0.8, 11, 7.2, 11)
    const prods = []
    this.order.products.forEach(p => {
      let extras = ''
      p.extras.forEach(pe => {
        pe.products.forEach(px => {
          extras = extras + ' / ' + px.name
        })
      })
      const pOrdered = [
        p.qty.toString(),
        p.name + extras,
        '$' + p.total
      ]
      prods.push(pOrdered)
    })
    if (this.order.tip && this.order.tip > 0) {
      const tip = [
        '1',
        'Propina',
        '$' + this.order.tip
      ]
      prods.push(tip)
    }
    if (this.order.comision && this.order.comision > 0) {
      const comision = [
        '1',
        'Comisión',
        '$' + this.order.comision
      ]
      prods.push(comision)
    }
    autoTable(doc, {
      theme: 'grid',
      styles: {fillColor: [0,0 ,0], lineColor: [0, 0, 0], lineWidth: 0.02, valign: 'middle', halign: 'center'},
      margin: 0.5,
      tableWidth: 7,
      startY: 11.5,
      bodyStyles: {fillColor: [250, 250, 250],},
      head: [['CANT', 'PRODUCTOS', 'PRECIO']],
      body: prods,
    })
    doc.save('test.pdf')
  }


}


export interface OrderBranch {
  name: string;
  orders: Order[]
}
