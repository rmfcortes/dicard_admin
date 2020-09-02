import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { ColorSketchModule } from 'ngx-color/sketch';
import { FontPickerModule } from 'ngx-font-picker';
import { FONT_PICKER_CONFIG } from 'ngx-font-picker';
import { FontPickerConfigInterface } from 'ngx-font-picker';

import { HomePage } from './home.page';

import { CropImageModalModule } from 'src/app/modals/crop-image/crop-image.module';
import { SharedModule } from 'src/app/shared/shared.module';

// Templates
import { FirstComponent } from 'src/app/templates/first/first.component';
import { SecondComponent } from 'src/app/templates/second/second.component';
import { ThirdComponent } from 'src/app/templates/third/third.component';

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
    FontPickerModule,
    ColorSketchModule,
    CropImageModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [
    HomePage,
    FirstComponent,
    SecondComponent,
    ThirdComponent,
  ],
  providers: [
    {
      provide: FONT_PICKER_CONFIG,
      useValue: DEFAULT_FONT_PICKER_CONFIG
    }
  ]
  
})
export class HomePageModule {}
