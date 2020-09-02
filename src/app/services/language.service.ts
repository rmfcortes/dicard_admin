import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    private translate: TranslateService
  ) { }

  getDefaultLanguage(){
    let language = this.translate.getBrowserLang()
    this.translate.setDefaultLang('es')
    return language
  }
 
  setLanguage(setLang) {
    this.translate.use(setLang)
  }
  
}
