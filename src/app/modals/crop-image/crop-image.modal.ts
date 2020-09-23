import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.modal.html',
  styleUrls: ['./crop-image.modal.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class CropImageModal implements OnInit {

  @Input() aspect: number
  @Input() isCover: boolean
  @Input() imageChangedEvent
  @Input() maintainAspectRatio: boolean


  preview = false
  imageReady = false
  imageReadyDesktop = false
  croppedImage: any = ''
  croppedImageDesktop: any = ''


  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  imageLoaded() {
    this.imageReady = true
  }

  imageLoadedDesktop() {
    this.imageReadyDesktop = true
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64
  }

  imageCroppedDesktop(event: ImageCroppedEvent) {
    this.croppedImageDesktop = event.base64
  }

  save() {
    const images = {
      mobile: this.croppedImage,
      desktop: this.croppedImageDesktop
    }
    if (this.isCover) this.modalCtrl.dismiss(images)
    else this.modalCtrl.dismiss(this.croppedImage)
  }

  close() {
    this.modalCtrl.dismiss()
  }

}
