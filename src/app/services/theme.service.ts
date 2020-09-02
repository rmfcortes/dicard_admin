import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { UidService } from './uid.service';

import { Font } from 'ngx-font-picker/lib/font-picker.interfaces';
import { Colors, Fonts } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private uidService: UidService,
    private db: AngularFireDatabase,
  ) { }

  createFont(font: Font) {
    return new Promise((resolve, reject) => {      
      const new_font = document.createElement('style')
      new_font.appendChild(document.createTextNode(`\
      @font-face {\
        font-family: ${font.family};\
        src: url(${font.files[font.style]});\
      }\
      `))
      document.head.appendChild(new_font)
      resolve()
    })
  }

  setAppTheme(colors: Colors, src: string) {
    this.updateColors(colors)
    const themeWrapper = document.querySelector('body')
    if (src === 'background' || src === 'all') {
      if (colors.backgroundGradientValue) {
        themeWrapper.style.setProperty('--backgroundColor', colors.backgroundGradientValue)
      } else {
        colors.background ? themeWrapper.style.setProperty('--backgroundColor', colors.background) : themeWrapper.style.setProperty('--backgroundColor', 'white')
      }
    }
    if (src === 'name' || src === 'all') colors.name ? themeWrapper.style.setProperty('--nameColor', colors.name) : themeWrapper.style.setProperty('--nameColor', 'black')
    if (src === 'employment' || src === 'all') colors.employment ? themeWrapper.style.setProperty('--employmentColor', colors.employment) : themeWrapper.style.setProperty('--employmentColor', 'grey')
    if (src === 'contact' || src === 'all') colors.contactTitle ? themeWrapper.style.setProperty('--contactColor', colors.contactTitle) : themeWrapper.style.setProperty('--contactColor', 'black')
    if (src === 'follow' || src === 'all') colors.followTitle ? themeWrapper.style.setProperty('--followColor', colors.followTitle) : themeWrapper.style.setProperty('--followColor', 'black')
    if (src === 'location' || src === 'all') colors.locationTitle ? themeWrapper.style.setProperty('--locationColor', colors.locationTitle) : themeWrapper.style.setProperty('--locationColor', 'black')
    if (src === 'icons' || src === 'all') colors.iconsText ? themeWrapper.style.setProperty('--iconsTextColor', colors.iconsText) : themeWrapper.style.setProperty('--iconsTextColor', 'black')
    if (src === 'fillButtons' || src === 'all') colors.fillButtons ? themeWrapper.style.setProperty('--buttonsFillColor', colors.fillButtons) : themeWrapper.style.setProperty('--buttonsFillColor', 'black')
    if (src === 'textButtons' || src === 'all') colors.textButtons ? themeWrapper.style.setProperty('--buttonsTextColor', colors.textButtons) : themeWrapper.style.setProperty('--buttonsTextColor', 'white')
    if (src === 'textButtons' || src === 'all') colors.textButtons ? themeWrapper.style.setProperty('--buttonsTextColor', colors.textButtons) : themeWrapper.style.setProperty('--buttonsTextColor', 'white')
    if (src === 'navigate' || src === 'all') colors.navigateIcon ? themeWrapper.style.setProperty('--navigateIconColor', colors.navigateIcon) : themeWrapper.style.setProperty('--navigateIconColor', 'black')
    colors.iconHomeTab ? themeWrapper.style.setProperty('--iconHomeColor', colors.iconHomeTab) : themeWrapper.style.setProperty('--iconHomeColor', 'white')
    colors.iconsTabs ? themeWrapper.style.setProperty('--iconsTabs', colors.iconsTabs) : themeWrapper.style.setProperty('--iconsTabs', 'black')
    colors.iconsTabsFocused ? themeWrapper.style.setProperty('--iconsTabsFocused', colors.iconsTabsFocused) : themeWrapper.style.setProperty('--iconsTabsFocused', 'grey')
    if (src === 'address' || src === 'all') colors.address ? themeWrapper.style.setProperty('--addressColor', colors.address) : themeWrapper.style.setProperty('--addressColor', 'black')
    if (src === 'header' || src === 'all') colors.segmentButton ? themeWrapper.style.setProperty('--segmentButtonColor', colors.segmentButton) : themeWrapper.style.setProperty('--segmentButtonColor', 'black')
    if (src === 'segment_focused' || src === 'all') colors.segmentButtonFocused ? themeWrapper.style.setProperty('--segmentButtonFocusedColor', colors.segmentButtonFocused) : themeWrapper.style.setProperty('--segmentButtonFocusedColor', 'grey')
    if (src === 'product_name' || src === 'all') colors.nameProduct ? themeWrapper.style.setProperty('--nameProductColor', colors.nameProduct) : themeWrapper.style.setProperty('--nameProductColor', 'black')
    if (src === 'product_description' || src === 'all') colors.descriptionProduct ? themeWrapper.style.setProperty('--descripProdColor', colors.descriptionProduct) : themeWrapper.style.setProperty('--descripProdColor', 'grey')
    if (src === 'product_price' || src === 'all') colors.priceProduct ? themeWrapper.style.setProperty('--priceProdColor', colors.priceProduct) : themeWrapper.style.setProperty('--priceProdColor', 'black')
    if (src === 'background_card' || src === 'all') colors.backgroundCard ? themeWrapper.style.setProperty('--backgroundCardColor', colors.backgroundCard) : themeWrapper.style.setProperty('--backgroundCardColor', 'white')
    this.uidService.setThemeInitialized()
  }

  setInitFonts(font: Fonts) {
    if (font) {
      if (font.name) document.querySelector('body').style.setProperty('--fontName', font.name.family)
      if (font.emplyment) document.querySelector('body').style.setProperty('--fontEmployment', font.emplyment.family)
      if (font.contactLabel) document.querySelector('body').style.setProperty('--fontContact', font.contactLabel.family)
      if (font.follow) document.querySelector('body').style.setProperty('--fontFollow', font.follow.family)
      if (font.header) document.querySelector('body').style.setProperty('--fontHeader', font.header.family)
      if (font.product_name) document.querySelector('body').style.setProperty('--fontProductName', font.product_name.family)
      if (font.product_description) document.querySelector('body').style.setProperty('--fontDescription', font.product_description.family)
      if (font.product_price) document.querySelector('body').style.setProperty('--fontPrice', font.product_price.family)
      if (font.location) document.querySelector('body').style.setProperty('--fontLocation', font.location.family)
      this.updateFonts(font)
      this.uidService.setFontInitialized()
    }
  }

  setFonts(font: Fonts, src: string) {
    if (font.name && src === 'name' || src === 'all') document.querySelector('body').style.setProperty('--fontName', font.name.family)
    if (font.emplyment && src === 'emplyment' || src === 'all') document.querySelector('body').style.setProperty('--fontEmployment', font.emplyment.family)
    if (font.contactLabel && src === 'contactLabel' || src === 'all') document.querySelector('body').style.setProperty('--fontContact', font.contactLabel.family)
    if (font.follow && src === 'follow' || src === 'all') document.querySelector('body').style.setProperty('--fontFollow', font.follow.family)
    if (font.header && src === 'header' || src === 'all') document.querySelector('body').style.setProperty('--fontHeader', font.header.family)
    if (font.product_name && src === 'product_name' || src === 'all') document.querySelector('body').style.setProperty('--fontProductName', font.product_name.family)
    if (font.product_description && src === 'product_description' || src === 'all') document.querySelector('body').style.setProperty('--fontDescription', font.product_description.family)
    if (font.product_price && src === 'product_price' || src === 'all') document.querySelector('body').style.setProperty('--fontPrice', font.product_price.family)
    if (font.location && src === 'location' || src === 'all') document.querySelector('body').style.setProperty('--fontLocation', font.location.family)
    if (font.address && src === 'address' || src === 'all') document.querySelector('body').style.setProperty('--fontAddress', font.address.family)
    this.updateFonts(font)
  }

  updateColors(colors: Colors) {
    const uid = this.uidService.getUid()
    this.db.object(`principal/${uid}/data/colors`).update(colors)
  }

  updateFonts(fonts: Fonts) {
    const uid = this.uidService.getUid()
    this.db.object(`principal/${uid}/data/font`).update(fonts)
  }

}
