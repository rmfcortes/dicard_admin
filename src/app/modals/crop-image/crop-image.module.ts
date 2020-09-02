import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CropImageModal } from './crop-image.modal';

import { ImageCropperModule  } from 'ngx-image-cropper';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ImageCropperModule,
  ],
  declarations: [CropImageModal],
  entryComponents: [CropImageModal]
})
export class CropImageModalModule {}
