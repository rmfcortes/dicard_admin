import { Component, OnInit, NgZone, HostListener } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { MenuController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { MapsAPILoader } from '@agm/core';
import { Font } from 'ngx-font-picker';
import { } from 'googlemaps';

import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

import { MainProfile, Sucursal } from 'src/app/interfaces/profile.interface';
import { ThemeService } from 'src/app/services/theme.service';
import { UidService } from 'src/app/services/uid.service';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  icon = '../../../assets/img/pin.png'

  profile: MainProfile
  profileReady = false
  mapReady = false

  maps = []

  err: string

  viewTheme = false

  pickerLocation = false
  pickerNavigate = false
  pickerAddress = false
  pickerFontLocation = false
  pickerFontAddress = false

  font_address: null
  font_location: null

  page = 'form'
  scrWidth: number
  hideMainCol = false

  @HostListener('window:resize')
  getScreenSize() {
    this.scrWidth = window.innerWidth
  }

  constructor(
    private ngZone: NgZone,
    private menu: MenuController,
    private inAppBrowser: InAppBrowser,
    private mapsAPILoader: MapsAPILoader,
    private translateService: TranslateService,
    private themeService: ThemeService,
    private alertService: AlertService,
    private userService: UserService,
    private uidService: UidService,
  ) { this.getScreenSize() }

  async ngOnInit() {
    this.menu.enable(true)
    await this.alertService.presentLoading()
    this.getProfile()
  }

  segmentChanged() {
    if (this.page === 'view') this.hideMainCol = true
    else this.hideMainCol = false
  }


  mapLoaded(event, i) {
    this.mapReady = true
    this.maps[i] = event
    if (!this.profile) {
      this.mapLoaded(event, i)
      return
    }
    this.styleMap()
  }

  getProfile() {
    this.userService.getProfile()
    .then(async (profile) => {
      this.profile = profile
      if (this.profile.address[0].pin) this.icon = this.profile.address[0].pin
      const isThemeInit = this.uidService.isthemeInitialized()
      if (!isThemeInit) this.setTheme('all')
      const isFontInit = this.uidService.isFontInitialized()
      if (!isFontInit) {
        if (this.profile.font) {
          const fuentes = Object.values(this.profile.font)
          const fuentesFil = fuentes.filter((value, index, self) => self.indexOf(value) === index)
          for (const iterator of fuentesFil) {
            await this.themeService.createFont(iterator)
          }
          this.themeService.setInitFonts(this.profile.font)
        }
        this.themeService.setInitFonts(this.profile.font)
      }
      this.profileReady = true
      setTimeout(() => {
        this.setAutocomplete()
      }, 300)
      this.alertService.dismissLoading()
    })
    .catch(err => {
      this.profileReady = true
      this.err = err
      setTimeout(() => {
        this.setAutocomplete()
      }, 300)
      this.alertService.dismissLoading()
    })
  }

  setTheme(src: string) {
    this.themeService.setAppTheme(this.profile.colors, src)
  }

  async changeFont(src: string, font: Font) {
    const archivos = Object.entries(font.files)
    archivos.forEach((file: any) => {
      const url = file[1].slice(4)
      font.files[file[0]] = 'https' + url
    })
    this.profile.font[src] = font
    await this.themeService.createFont(this.profile.font[src])
    this.themeService.setFonts(this.profile.font, src)
  }

  goMaps(i: number) {
    const dir = this.profile.address[i].address.replace(/ /g, '+')
    const page = `https://www.google.com/maps/?q=${dir}`
    this.inAppBrowser.create(page, '_self');
  }

  setAutocomplete() {
    this.mapsAPILoader.load().then(async () => {
      this.profile.address.forEach((a, i) => {
        const nativeHomeInputBox = document.getElementById('address' + i).getElementsByTagName('input')[0]
        const autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, { types: ['address'] })
        autocomplete.addListener('place_changed', () => {
            this.ngZone.run(async () => {
                // get the place result
                const place: google.maps.places.PlaceResult = autocomplete.getPlace()
  
                // verify result
                if (place.geometry === undefined || place.geometry === null) return
                // set latitude, longitude
                this.profile.address[i].lat = place.geometry.location.lat()
                this.profile.address[i].lng = place.geometry.location.lng()
                this.profile.address[i].address = place.formatted_address
                await this.userService.setProfile(this.profile)
            })
        })
      })
    })
  }

  setProfile() {
    this.userService.setProfile(this.profile)
  }

  newBranch() {
    this.profile.address.push({
      address: '',
      lat: null,
      lng: null,
      name: '',
    })
    const i = this.profile.address.length - 1
    setTimeout(() => {
      const nativeHomeInputBox = document.getElementById('address' + i).getElementsByTagName('input')[0]
      const autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, { types: ['address'] })
      autocomplete.addListener('place_changed', () => {
          this.ngZone.run(async () => {
              // get the place result
              const place: google.maps.places.PlaceResult = autocomplete.getPlace()
  
              // verify result
              if (place.geometry === undefined || place.geometry === null) return
              // set latitude, longitude
              this.profile.address[i].lat = place.geometry.location.lat()
              this.profile.address[i].lng = place.geometry.location.lng()
              this.profile.address[i].address = place.formatted_address
              await this.userService.setProfile(this.profile)
          })
      })
    }, 500);
  }

  async saveLocation(evento) {
    this.profile.address[0].lat = evento.coords.lat
    this.profile.address[0].lng = evento.coords.lng
    await this.userService.setProfile(this.profile)
  }

  async setPin(file) {
    if (file.srcElement.files[0].type === 'image/png') {
      this.icon = await this.toBase64(file.srcElement.files[0])
      this.profile.address[0].pin = await this.userService.uploadPhoto(this.icon.split('data:image/png;base64,')[1], 'pin')
      this.userService.setProfile(this.profile)
    } else {
      this.translateService.get('MAPS.pngFile').subscribe(text => {
        this.alertService.presentAlert('', text)
      })
    }
  }

  toBase64(file): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  styleMap() {
    if (!this.profile.address[0].poi && this.profile.address[0].dark) this.poiDarkMode()
    if (!this.profile.address[0].poi && !this.profile.address[0].dark) this.poiLightMode()
    if (this.profile.address[0].poi && this.profile.address[0].dark) this.cleanDarkMode()
    if (this.profile.address[0].poi && !this.profile.address[0].dark) this.cleanLigthMode()
    this.userService.setProfile(this.profile)
  }

  cleanLigthMode()  {
    const styles = {
      default: null,
      hide: [
        {
          featureType: 'poi.business',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{visibility: 'off'}]
        }
      ]
    }
    this.maps.forEach(m => m.setOptions({styles: styles['hide']}))
  }

  poiLightMode() {
    const styles = {
      default: null,
      show: [
        {
          featureType: 'poi.business',
          stylers: [{visibility: 'on'}]
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{visibility: 'on'}]
        }
      ]
    };
    this.maps.forEach(m => m.setOptions({styles: styles['show']}))

  }

  cleanDarkMode() {
    const styles = {
      default: null,
      cleanDark: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.business',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    }
    this.maps.forEach(m => m.setOptions({styles: styles['cleanDark']}))

  }

  poiDarkMode() {
    const styles = {
      default: null,
      poiDark: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    }
    this.maps.forEach(m => m.setOptions({styles: styles['poiDark']}))
  }

}
