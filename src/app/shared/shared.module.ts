import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SeparadorEstrellaComponent } from '../components/separador-estrella/separador-estrella.component';
import { PreloadImageComponent } from '../components/pre-load-image/pre-load-image.component';



@NgModule({
    imports: [
      CommonModule,
      IonicModule,
    ],
    declarations: [
      PreloadImageComponent,
      SeparadorEstrellaComponent
    ],
    exports: [
      PreloadImageComponent,
      SeparadorEstrellaComponent
    ]
  })

  export class SharedModule {}