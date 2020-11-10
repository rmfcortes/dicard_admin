import { Component, HostListener, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { jsPDF } from 'jspdf';
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
    // const doc = new jsPDF();
 
    // doc.text("Hello world!", 10, 10);
    // doc.save("a4.pdf");
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
        console.log(this.logo);
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

  downloadAsPDF() {

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'cm',
      format: [16, 8]
    })
    doc.text(this.order.idTrack, 1, 1)
    doc.text(this.order.branch.address, 1, 2)
    doc.save('test.pdf')
    // html2canvas(document.getElementById('ticket'), { useCORS: true }).then(canvas => {
    //   const img = canvas.toDataURL('image/png')
    //   const logo = document.getElementById('logo')
    //   console.log(logo);
    //   // doc.addImage(logo, 'JPEG', 20, 20, 180, 160)
    //   doc.addImage(img, 'JPEG', 20, 20, 180, 160)
    // })

  }

}


export interface OrderBranch {
  name: string;
  orders: Order[]
}
