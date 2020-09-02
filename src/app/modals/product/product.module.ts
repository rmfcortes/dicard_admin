import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { ProductModal } from './product.modal';
import { CropImageModalModule } from '../crop-image/crop-image.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    CropImageModalModule,
  ],
  declarations: [ProductModal],
  entryComponents: [ProductModal]
})
export class ProductModalModule {}
