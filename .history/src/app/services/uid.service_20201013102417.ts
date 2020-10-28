import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MainProfile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class UidService {

  uid: string
  name: string
  subdominio: string

  empty_profile: MainProfile = {
    address: [{
      address: '',
      lat: null,
      lng: null,
      name: ''
    }],
    about: '',
    cover_desktop: '',
    colors: {
      light: '',
      primary: '',
      contrast: '',

      aboutDesc: '',
      aboutTitle: '',

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
      textButtons: '',
      segmentButtonFocusedText: ''
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
    template_desktop: 'first',
    view: 'list-img',
    whatsApp: '',
    social_net: [],
    description: [],
    type: ''
  }

  profileEmpty = true
  authChecked = false

  themeInitialized = false
  fontInitialized = false

  profile: MainProfile
  profile_sub = new BehaviorSubject<MainProfile>(null)

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
    this.profile_sub.next(profile)
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
