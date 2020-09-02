import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { ColorSketchModule } from 'ngx-color/sketch';
import { NgxMasonryModule } from 'ngx-masonry';
import { FontPickerModule } from 'ngx-font-picker';
import { FONT_PICKER_CONFIG } from 'ngx-font-picker';
import { FontPickerConfigInterface } from 'ngx-font-picker';

import { ProductModalModule } from 'src/app/modals/product/product.module';
import { ProductsPageRoutingModule } from './products-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { ProductsPage } from './products.page';

// Views
import { ListComponent } from './views/list/list.component';
import { BlockComponent } from './views/block/block.component';
import { CardsComponent } from './views/cards/cards.component';
import { GalleryComponent } from './views/gallery/gallery.component';
import { ListImgComponent } from './views/list-img/list-img.component';


import { environment } from 'src/environments/environment.prod';

const DEFAULT_FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  // Change this to your Google API key
  apiKey: environment.mapsApiKey
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TranslateModule,
    NgxMasonryModule,
    FontPickerModule,
    ColorSketchModule,
    ProductModalModule,
    ProductsPageRoutingModule
  ],
  declarations: [
    ProductsPage,
    ListComponent,
    BlockComponent,
    CardsComponent,
    GalleryComponent,
    ListImgComponent,
  ],
  providers: [
    {
      provide: FONT_PICKER_CONFIG,
      useValue: DEFAULT_FONT_PICKER_CONFIG
    }
  ],
})
export class ProductsPageModule {}
