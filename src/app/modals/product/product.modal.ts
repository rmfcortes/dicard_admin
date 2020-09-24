import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { CropImageModal } from '../crop-image/crop-image.modal';

import { AlertService } from 'src/app/services/alert.service';

import { ExtraList, Product, ProductExtra, Section } from 'src/app/interfaces/products.interface';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.modal.html',
  styleUrls: ['./product.modal.scss'],
})
export class ProductModal implements OnInit {

  @Input() product: Product
  @Input() sections: Section[]

  extras: ExtraList[] = []

  product_original: Product = {
    stock: true,
    description: [{
      subHeader: '',
      text: ['']
    }],
    id: '',
    name: '',
    section: '',
    price: 1,
    url: '',
    url_desktop: '',
    new: false,
    has_extras: false,
  }

  noPhoto = '../../../assets/img/no-image-cover.png'
  base64 = ''
  base64Destop = ''

  saving = false

  oldSection = ''
  let_change = false
  pending_changes = false


  constructor(
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    private productService: ProductsService,
    private alertService: AlertService,
  ) { }

  async ngOnInit() {
    if (!this.product.new) this.copy(this.product, this.product_original)
    this.oldSection = this.product.section
    this.getExtras()
  }

  ionViewDidEnter() {
    setTimeout(() => this.let_change = true, 350)
  }

  async cropImage(imageChangedEvent, aspect, maintainAspectRatio) {
    const modal = await this.modalCtrl.create({
      component: CropImageModal,
      componentProps: {imageChangedEvent, aspect, maintainAspectRatio, isCover: true}
    })
    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        this.product.url = resp.data.mobile
        this.base64 = resp.data.mobile.split('data:image/png;base64,')[1]
        this.base64Destop = resp.data.desktop.split('data:image/png;base64,')[1]
        this.pending_changes = true
      }
    })
    return await modal.present()
  }

  getExtras() {
      if (this.product.has_extras) {
        this.productService.getExtras(this.product.id).then((extras: ExtraList[]) => this.extras = extras)
      }
  }

  formularioChange() {
    if (this.product.new) return
    if (!this.let_change) return
    this.pending_changes = true
  }

  lineChange(value: string, i: number, y: number) {
    this.product.description[i].text[y] = value
  }

  // Actions

  async newExtra() {
    this.alertService.presentAlertPrompt('Nueva lista de complementos', 'Titulo de la lista', 'Agregar lista', 'Cancelar')
      .then((header: string) => {
        header = header.trim()
        if (!header) return
        const complemento: ExtraList = {
          qty: 1,
          header,
          required: false,
          products: []
        }
        this.extras.push(complemento)
        this.pending_changes = true
      })
  }

  async addExtraOption(i) {
    this.alertService.presentPromptComplementos()
    .then((producto: ProductExtra) => {
      producto.name = producto.name.trim()
      if (!producto.name) return
      if (!/^[0-9]+$/.test(producto.price)) {
        this.alertService.presentAlert('Precio inválido', 'El precio debe incluir sólo números enteros')
        return
      }
      producto.price = parseInt(producto.price, 10)
      this.extras[i].products.push(producto)
      this.pending_changes = true
    })
  }

  deleteExtraList(i) {
    this.pending_changes = true
    this.extras.splice(i, 1)
  }

  deleteExtraOption(i, y) {
    this.pending_changes = true
    this.extras[i].products.splice(y, 1)
  }

  pasilloElegido(event) {
    this.pending_changes = true
    this.product.section = event.detail.value
  }

  async save() {
    if (this.product.new && !this.product.stock) {
      this.alertService.presentAlert('', 'Por agrega productos a tu lista hasta que tengas inventario de ellos')
      return
    }

    this.product.name = this.product.name.trim()
    if (!this.product.name || !this.product.description || !this.product.price) {
      this.alertService.presentAlert('', 'Por favor completa todos los campos')
      return
    }
    if (isNaN(this.product.price)) {
      this.alertService.presentAlert('Precio inválido', 'El precio debe incluir sólo números reales')
      return
    }
    await this.alertService.presentLoading('Estamos guardando la información del producto. Este proceso puede tardar algunos minutos. Por favor no cierres ni actualices la página')
    this.saving = true
    try {
      if (this.base64) {
        this.product.url = await this.productService.uploadPhoto(this.base64, this.product, 'mobile')
        this.product.url_desktop = await this.productService.uploadPhoto(this.base64Destop, this.product, 'desktop')
        this.base64 = ''
      }
      if (this.oldSection && this.oldSection !== this.product.section) {
        this.productService.sectionChange(this.oldSection, this.product.id)
      }
      await this.productService.setProduct(this.product, this.extras)
      this.saving = false
      this.alertService.dismissLoading()
      this.modalCtrl.dismiss(this.product)
    } catch (error) {
      this.saving = false
      this.alertService.dismissLoading()
      this.translateService.get('COMMON.someWrong').subscribe(text => {
        this.alertService.presentAlert('', text + ' ' + error)
      })
    }
  }

  deleteProduct() {
    this.translateService.get(['COMMON.delete', 'COMMON.sure', 'COMMON.cancel', 'COMMON.ok']).subscribe(text => {
      this.alertService.presentAlertAction(text['COMMON.delete'] + ' ' +this.product.name, text['COMMON.sure'], text['COMMON.cancel'], text['COMMON.ok'])
      .then(resp => {
        if (resp) {
          this.productService.deleteProduct(this.product)
          this.modalCtrl.dismiss('deleted')
        }
      })
    })
  }

  close() {
    if (this.pending_changes) {
      this.alertService.presentAlertAction('Cambios pendientes', 'Tienes cambios pendientes por guardar, ¿te gustaría guardarlos?', 'Guardar cambios', 'Descartar cambios')
      .then(resp => resp ? this.save() : this.dismissChanges())
      return
    }
    this.modalCtrl.dismiss()
  }

  dismissChanges() {
    if (!this.product.new) this.copy(this.product_original, this.product)
    this.modalCtrl.dismiss()
  }

  copy(producto: Product, copia: Product) {
    copia.description = producto.description ? producto.description : null
    copia.has_extras = producto.has_extras ? true : false
    copia.code = producto.code ? producto.code : null
    copia.url = producto.url ? producto.url : null
    copia.stock = producto.stock ? true : false
    copia.section = producto.section
    copia.name = producto.name
    copia.price = producto.price
    copia.id = producto.id
  }

}
