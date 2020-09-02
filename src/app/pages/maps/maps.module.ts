import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule } from '@agm/core';
import { ColorSketchModule } from 'ngx-color/sketch';
import { FontPickerModule } from 'ngx-font-picker';
import { FONT_PICKER_CONFIG } from 'ngx-font-picker';
import { FontPickerConfigInterface } from 'ngx-font-picker';

import { MapsPageRoutingModule } from './maps-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { MapsPage } from './maps.page';

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
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey
    }),
    MapsPageRoutingModule
  ],
  declarations: [MapsPage],
  providers: [
    InAppBrowser,
    {
      provide: FONT_PICKER_CONFIG,
      useValue: DEFAULT_FONT_PICKER_CONFIG
    }
  ],
})
export class MapsPageModule {}
