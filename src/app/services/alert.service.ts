import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  loader: any;

  constructor(
    public loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async presentAlertRadio(titulo, msn, inputs) {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: titulo,
        message: msn,
        inputs,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(false);
            }
          }, {
            text: 'Asignar',
            handler: (data) => {
              resolve(data);
            }
          }
        ]
      });

      await alert.present();
    });
  }

  async presentAlert(titulo, msn) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msn,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    })

    await alert.present()
  }

  async presentAlertPrompt(titulo, placeholder) {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: titulo,
        inputs: [
          {
            name: 'name1',
            type: 'text',
            placeholder
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              resolve(data.name1)
            }
          }
        ]
      })
      await alert.present()
    })
  }

  async presentAlertAction(titulo, msn, cancelButton, okButton) {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: titulo,
        message: msn,
        buttons: [
          {
            text: cancelButton,
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(false)
            }
          },
          {
            text: okButton,
            cssClass: 'secondary',
            handler: () => {
              resolve(true)
            }
          }
        ]
      })

      await alert.present()
    })
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     spinner: 'dots'
    })
    return await this.loader.present()
  }

  dismissLoading() {
    if (this.loader) this.loader.dismiss()
  }

}
