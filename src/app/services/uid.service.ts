import { Injectable } from '@angular/core';
import { MainProfile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class UidService {

  uid: string
  name: string
  subdominio: string

  empty_profile: MainProfile = {
    address: {
      address: '',
      lat: null,
      lng: null
    },
    colors: {
      address: '',
      background: '',
      backgroundCard: '',
      contactTitle: '',
      descriptionProduct: '',
      employment: '',
      fillButtons: '',
      followTitle: '',
      locationTitle: '',
      navigateIcon: '',
      iconHomeTab: '',
      iconsTabs: '',
      iconsTabsFocused: '',
      iconsText: '',
      name: '',
      nameProduct: '',
      priceProduct: '',
      segmentButton: '',
      segmentButtonFocused: '',
      textButtons: ''
    },
    font: null,
    company: '',
    contact: [],
    cover: '',
    vertical_cover: '',
    email: '',
    employment: '',
    name: '',
    phone: '',
    photo: '',
    template: 'first',
    view: 'list-img',
    whatsApp: '',
    social_net: [],
    description: ''
  }

  profileEmpty = true
  authChecked = false

  themeInitialized = false
  fontInitialized = false

  profile: MainProfile

  constructor( ) {
    this.profile = this.empty_profile
  }

  setUid(uid) {
    this.uid = uid
  }

  getUid() {
    return this.uid
  }

  setName(name) {
    this.name = name
  }

  getName() {
    return this.name
  }

  getProfile() {
    return this.profile
  }

  setProfile(profile: MainProfile) {
    this.profile = profile
  }

  getProfileEmpty() {
    return this.profileEmpty
  }

  clearProfile() {
    this.profile = this.empty_profile
  }

  setProfileEmpty(value: boolean) {
    this.profileEmpty = value
  }

  getAuthChecked() {
    return this.authChecked
  }

  setAuthChecked() {
    this.authChecked = true
  }

  isthemeInitialized() {
    return this.themeInitialized
  }

  setThemeInitialized() {
    this.themeInitialized = true
  }

  isFontInitialized() {
    return this.fontInitialized
  }

  setFontInitialized() {
    this.fontInitialized = true
  }

}
