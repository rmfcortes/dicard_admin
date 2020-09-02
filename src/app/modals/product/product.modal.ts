import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { CropImageModal } from '../crop-image/crop-image.modal';

import { AlertService } from 'src/app/services/alert.service';

import { Product, Section } from 'src/app/interfaces/products.interface';
import { ProductsService } from 'src/app/services/products.service';



@Component({
  selector: 'app-product',
  templateUrl: './product.modal.html',
  styleUrls: ['./product.modal.scss'],
})
export class ProductModal implements OnInit {

  @Input() product: Product;
  @Input() sections: Section[];

  noPhoto = '../../../assets/img/no-image-cover.png';
  base64 = '';

  saving = false;

  oldSection = '';


  constructor(
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    private productService: ProductsService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.oldSection = this.product.section;
  }

  async cropImage(imageChangedEvent, aspect, maintainAspectRatio) {
    const modal = await this.modalCtrl.create({
      component: CropImageModal,
      componentProps: {imageChangedEvent, aspect, maintainAspectRatio}
    });
    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        this.product.url = resp.data;
        this.base64 = resp.data.split('data:image/png;base64,')[1];
      }
    });
    return await modal.present();
  }

  async save() {
    this.saving = true
    await this.alertService.presentLoading()
    try {
      if (this.base64) {
        this.product = await this.productService.uploadPhoto(this.base64, this.product)
        this.base64 = ''
      }
      if (this.oldSection && this.oldSection !== this.product.section) {
        this.productService.sectionChange(this.oldSection, this.product.id)
      }
      await this.productService.setProduct(this.product);
      this.saving = false;
      this.alertService.dismissLoading();
      this.modalCtrl.dismiss(this.product);
    } catch (error) {
      this.saving = false;
      this.alertService.dismissLoading();
      this.translateService.get('COMMON.someWrong').subscribe(text => {
        this.alertService.presentAlert('', text + ' ' + error);
      })
    }
  }

  deleteProduct() {
    this.translateService.get(['COMMON.delete', 'COMMON.sure', 'COMMON.cancel', 'COMMON.ok']).subscribe(text => {
      this.alertService.presentAlertAction(text["COMMON.delete"] + ' ' +this.product.name, text["COMMON.sure"], text["COMMON.cancel"], text["COMMON.ok"])
      .then(resp => {
        if (resp) {
          this.productService.deleteProduct(this.product);
          this.modalCtrl.dismiss('deleted')
        }
      })
    })
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
