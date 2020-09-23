import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, IonInput } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { Font } from 'ngx-font-picker';

import { ProductModal } from 'src/app/modals/product/product.modal';

import { ProductsService } from 'src/app/services/products.service';
import { AlertService } from 'src/app/services/alert.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';

import { Section, Product } from 'src/app/interfaces/products.interface';
import { MainProfile } from 'src/app/interfaces/profile.interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild('inputSection', {static: false}) inputSection: IonInput;
  @ViewChild('inputSectionEdit', {static: false}) inputSectionEdit: IonInput;

  profile: MainProfile
  sections: Section[] = []

  infiniteCall: number
  loadedProducts: number
  ySection = 0

  batch = 15
  lastKey = ''
  noMore = false
  
  sectionSelected = ''
  changingSection = false

  loadingProds = true
  hasOffer = false
  infoReady = false

  error: string

  viewSectionInput = false
  viewSectionList = false
  viewProducts = false
  viewColors = false

  pickerHeader = false
  pickerHeaderSelected = false
  pickerNameProduct = false
  pickerDescription = false
  pickerPrice = false
  pickerBackgroundCard = false

  pickerFontHeader = false
  pickerFontName = false
  pickerFontDescription = false
  pickerFontPrice = false
  
  newSection: string

  beforeEdit: string

  product: Product

  font_header: null
  font_product_name: null
  font_product_price: null
  font_product_description: null

  page = 'form'
  scrWidth: number
  hideMainCol = false

  @HostListener('window:resize')
  getScreenSize() {
    this.scrWidth = window.innerWidth
  }

  constructor(
    private modalCtrl: ModalController,
    private productService: ProductsService,
    private translateService: TranslateService,
    private themeService: ThemeService,
    private alertService: AlertService,
    private userService: UserService,
  ) { this.getScreenSize() }

  async ngOnInit() {
    await this.alertService.presentLoading()
    this.getProfile('all')
  }

  segmentChanged() {
    if (this.page === 'view') this.hideMainCol = true
    else this.hideMainCol = false
  }

  showSectionInput() {
    this.viewSectionInput = true
    setTimeout(() => this.inputSection.setFocus(), 300)
  }

  setTheme(src: string) {
    this.themeService.setAppTheme(this.profile.colors, src)
  }

  async changeFont(src: string, font: Font) {
    const archivos = Object.entries(font.files)
    archivos.forEach((file: any) => {
      const url = file[1].slice(4)
      font.files[file[0]] = 'https' + url
    })
    this.profile.font[src] = font
    await this.themeService.createFont(this.profile.font[src])
    this.themeService.setFonts(this.profile.font, src)
  }

  // Section form

  addSection() {
    if (!this.sections || this.sections.length === 0) {
      this.sections = []
      this.sections[0] = {
        name: this.newSection,
        priority: 1,
        products: []
      }
    } else {
      this.sections[this.sections.length] = {
        name: this.newSection,
        priority: this.sections.length + 1,
        products: []
      }
    }
    this.productService.updateSections(this.sections);
    this.newSection = ''
    this.viewSectionInput = false
  }

  editSection(i: number) {
    this.unselectEdit()
    this.beforeEdit = this.sections[i].name
    this.sections[i].edit = true
    setTimeout(() => {
      this.inputSectionEdit.setFocus()
    }, 300)
  }

  saveEditSection() {
    this.unselectEdit()
    this.beforeEdit = ''
    this.productService.updateSections(this.sections)
  }

  cancelEdit(i: number) {
    this.sections[i].name = this.beforeEdit
    this.beforeEdit = ''
    this.unselectEdit()
  }

  unselectEdit() {
    this.sections.forEach(s => {
      s.edit = null
    })
  }

  async removeSection(i: number, section: string) {
    this.translateService.get(['COMMON.delete', 'COMMON.sureSection', 'COMMON.cancel', 'COMMON.ok']).subscribe(text => {
      this.alertService.presentAlertAction(text['COMMON.delete'] + ' ' + section, text['COMMON.sureSection'], text['COMMON.cancel'], text['COMMON.ok'])
      .then(resp => {
        if (resp) {
          this.sections.splice(i, 1)
          this.sections.forEach((p, iSec) => p.priority = iSec + 1)
          this.productService.updateSections(this.sections)
          this.productService.removeSection(section)
          this.translateService.get('PRODUCTS.deletedSection').subscribe(textProds => {
            this.alertService.presentToast('<ion-icon name="checkmark-circle" color="success"></ion-icon> ' + textProds)
          })
        }
      })
    })
  }

  doReorder(event) {
    const itemMove = this.sections.splice(event.detail.from, 1)[0]
    this.sections.splice(event.detail.to, 0, itemMove)
    this.sections.forEach((p, i) => p.priority = i + 1)
    event.detail.complete()
    this.productService.updateSections(this.sections)
  }

  // Product form

  async productForm(product: Product) {
    if (product) product.new = false
    else {
      product = {
        code: '',
        description: '',
        id: '',
        name: '',
        section: '',
        price: null,
        unit: '',
        url: '',
        new: true,
        stock: true,
        has_extras: false,
      }
    }
    const modal = await this.modalCtrl.create({
      component: ProductModal,
      componentProps: {product, sections: this.sections}
    })

    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        if (resp.data === 'deleted') {
          const i = this.sections.findIndex(p => p.name === product.section)
          this.sections[i].products = this.sections[i].products.filter(r => r.id !== product.id)
          this.translateService.get('PRODUCTS.deleted').subscribe(text => {
            this.alertService.presentToast('<ion-icon name="checkmark-circle" color="success"></ion-icon> ' + text)
          })
        } else {
          if (!product.new) {
            const i = this.sections.findIndex(p => p.name === product.section)
            const y = this.sections[i].products.findIndex(p => p.id === product.id)
            this.sections[i].products[y] = product
          } else {
            this.newProduct(resp.data)
          }
        }
      }
    });
    return await modal.present()
  }

  newProduct(product: Product) {
    const i = this.sections.findIndex(p => p.name === product.section)
    if (i >= 0) {
      if (!this.sections[i].products || this.sections[i].products.length === 0) this.sections[i].products = []
      this.sections[i].products.unshift(product)
      this.loadedProducts += 1
    } else {
      console.log('Not found')
    }
  }

  // Color form
  
  saveColor() {
    this.userService.setProfile(this.profile)
  }

  // Get Profile

  getProfile(src: string) {
    this.userService.getProfile()
    .then(profile => {
      this.profile = profile
      this.themeService.setAppTheme(profile.colors, src)
      this.getSections()
    })
    .catch(err => {
      alert(err)
      this.error = err
      this.alertService.dismissLoading()
    })
  }

  // Get Sections

  getSections() {
    this.productService.getSections()
    .then(sections => {
      if (sections && sections.length > 0) {
        this.sections = sections
        this.sections = this.sections.sort((a, b) => a.priority - b.priority)
        this.initGetProds()
      } else {
        this.alertService.dismissLoading()
        this.infoReady = true;
        this.loadingProds = false;
      }
    })
    .catch(err => {
      this.alertService.dismissLoading()
      alert(err)
      this.error = err
    })
  }

  // Get and Load Products with Infinite Scroll

  initGetProds() {
    this.infiniteCall = 1
    this.loadedProducts = 0
    this.loadingProds = true
    this.ySection = 0
    this.getProds()
  }

  async getProds(event?) {
    return new Promise(async (resolve, reject) => {
      const products = await this.productService
      .getProducts(this.batch + 1, this.lastKey, this.sections[this.ySection].name)
      this.changingSection = false
      if (products && products.length > 0) {
        this.lastKey = products[products.length - 1].id
        this.evaluateProducts(products, event)
      } else if ( this.ySection + 1 < this.sections.length ) {
        this.ySection++
        this.lastKey = null
        if (this.loadedProducts < this.batch * this.infiniteCall) this.getProds()
      } else {
        this.noMore = true
        this.infoReady = true
        this.loadingProds = false
        this.alertService.dismissLoading()
        if (event) event.target.complete()
        resolve()
      }
    })
  }

  async evaluateProducts(products, event?) {
    if (products.length === this.batch + 1) {
      products.pop()
      return await this.loadProducts(products, event)
    } else if (products.length === this.batch && this.ySection + 1 < this.sections.length) {
      return await this.nextSection(products, event)
    } else if (this.ySection + 1 >= this.sections.length) {
      this.noMore = true
      if (event) event.target.complete()
      return await this.loadProducts(products, event)
    }
    if (products.length < this.batch && this.ySection + 1 < this.sections.length) {
      await this.nextSection(products, event)
      if (this.loadedProducts < this.batch * this.infiniteCall) return this.getProds()
    } else {
      this.loadProducts(products, event)
      this.noMore = true
    }
  }

  async nextSection(products, event?) {
    return new Promise(async (resolve, reject) => {
      await this.loadProducts(products, event)
      this.lastKey = null
      this.ySection++
      resolve()
    })
  }

  async loadProducts(prods: Product[], event?) {
    return new Promise(async (resolve, reject) => {
      this.loadedProducts += prods.length
      if (!this.sections[this.ySection].products) this.sections[this.ySection].products = []
      this.sections[this.ySection].products = this.sections[this.ySection].products.concat(prods)
      if (event) event.target.complete()
      resolve()
      this.infoReady = true
      this.loadingProds = false
      this.alertService.dismissLoading()
    })
  }

  loadMoreProducts(event) {
    if (this.changingSection) {
      event.target.complete()
      return
    }
    this.infiniteCall++
    if (this.noMore) {
      event.target.disabled = true
      event.target.complete()
      return
    }
    this.getProds(event)

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) event.target.disabled = true
  }

  // Get and Load Products with Infinite Scroll within Section

  loadMoreSectionProducts(event) {
    if (this.changingSection) {
      event.target.complete()
      return
    }
    if (this.noMore) {
      event.target.disabled = true
      event.target.complete()
      return
    }
    this.getSectionProducts(event)

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) event.target.disabled = true
  }

  async getSectionProducts(event?) {
    this.loadingProds = true
    const products = await this.productService
      .getProducts(this.batch + 1, this.lastKey, this.sectionSelected)
    this.changingSection = false
    if (products && products.length > 0) {
      this.lastKey = products[products.length - 1].id
      this.loadSectionProducts(products, event)
    } else {
      if (event) event.target.complete()
      this.loadingProds = false
      this.noMore = true
    }
  }

  loadSectionProducts(products, event) {
    this.loadedProducts += products.length
    if (products.length === this.batch + 1) {
      this.lastKey = products[products.length - 1].id
      products.pop()
    } else {
      this.noMore = true
    }
    const i = this.sections.findIndex(p => p.name === this.sectionSelected)
    if (!this.sections[i].products || this.sections[i].products.length === 0) {
      this.sections[i].products = [...products]
    } else {
      this.sections[i].products = this.sections[i].products.concat(products)
    }
    if (event) event.target.complete()
    this.loadingProds = false
  }

  reset(section?) {
    this.changingSection = true
    this.lastKey = ''
    this.ySection = 0
    this.sections.forEach(p => p.products = [])
    this.loadedProducts = 0
    this.infiniteCall = 1
    this.noMore = false
    this.infiniteScroll.disabled = false
    this.sectionSelected = section
    if (!section) this.getProds()
    else this.getSectionProducts()
  }

  // Simulate Modal Product

  showProduct(product: Product) {
    this.product = product
  }

}
