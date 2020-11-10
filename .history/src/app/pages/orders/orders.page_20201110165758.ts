import { Component, HostListener, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { jsPDF, TextOptionsLight } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';

import { MainProfile, Ticket } from 'src/app/interfaces/profile.interface';
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

  ticket: Ticket = {
    base64: '',
    width: 0
  }

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
        this.ticket = await this.userService.getLogo(res.master)
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
      this.ticket = await this.userService.getLogo()
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
    const total = [
      '',
      'TOTAL',
      '$' + this.order.total
    ]
    prods.push(total)

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'cm',
      format: [(prods.length * 1.5) + this.ticket.width + 3, this.ticket.width]
    })
    const options: TextOptionsLight = {
      align: 'center',
      maxWidth: this.ticket.width - 0.8,
    }

    const date = new Date(this.order.createdAt)

    const y = this.ticket.width
    doc.addImage(this.ticket.base64, 'JPEG', 0.4, 0.1, this.ticket.width - 0.8, this.ticket.width - 0.8)

    doc.setFontSize(18)
    doc.text(this.order.idTrack, this.ticket.width / 2, y, options)
    doc.setFontSize(12)
    doc.text(date.toLocaleString(), this.ticket.width / 2, y + 0.5, options)
    doc.text(this.order.branch.address, this.ticket.width / 2, y + 1, options)
    doc.setLineWidth(0.1)
    doc.line(0.4, y + 3, this.ticket.width - 0.4, y + 3)
    autoTable(doc, {
      theme: 'grid',
      styles: {fillColor: [0,0 ,0], lineColor: [0, 0, 0], lineWidth: 0.02, valign: 'middle', halign: 'center'},
      margin: 0.4,
      tableWidth: this.ticket.width - 0.8,
      startY: y+3,
      bodyStyles: {fillColor: [250, 250, 250],},
      head: [['CANT', 'PRODUCTOS', 'PRECIO']],
      body: prods,
    })

    console.log(doc.internal.pageSize.height);
    console.log(doc.internal.pageSize.width);
    
    doc.save('test.pdf')
  }


}


export interface OrderBranch {
  name: string;
  orders: Order[]
}
