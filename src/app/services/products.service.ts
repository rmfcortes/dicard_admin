import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { UidService } from './uid.service';

import { Section, Product } from '../interfaces/products.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private fireStorage: AngularFireStorage,
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  updateSections(sections: Section[]) {
    return new Promise(async(resolve, reject) => {      
      try {
        const uid = this.uidService.getUid()
        sections.forEach((s, i) => s.edit = null)
        const sectionDb: Section[] = sections.filter(s => s.name)
        sectionDb.forEach(s => delete s.products)
        await this.db.object(`principal/${uid}/sections`).set(sectionDb)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  getSections(): Promise<Section[]>{
    return new Promise((resolve, reject) => {
      try {
        const uid = this.uidService.getUid()
        const sectionSub = this.db.object(`principal/${uid}/sections`).valueChanges().subscribe((sections: Section[]) => {
          sectionSub.unsubscribe()
          return resolve(sections)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  editSection(i: number, name: string) {
    const uid = this.uidService.getUid()
    this.db.object(`principal/${uid}/sections/${i+1}/name`).set(name)
  }

  removeSection(section: string) {
    const uid = this.uidService.getUid()
    this.db.object(`principal/${uid}/products/${section}`).remove()
  }

  getProducts(batch, lastKey, section): Promise<Product[]>{
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid()
      if (lastKey) {
        const x = this.db.list(`principal/${uid}/products/${section}`, data =>
          data.orderByKey().limitToFirst(batch).startAt(lastKey)).valueChanges().subscribe(async (products: Product[]) => {
            x.unsubscribe()
            resolve(products)
          })
      } else {
        const x = this.db.list(`principal/${uid}/products/${section}`, data =>
          data.orderByKey().limitToFirst(batch)).valueChanges().subscribe(async (products: Product[]) => {
            x.unsubscribe()
            resolve(products)
          })
      }
    })
  }

  uploadPhoto(photo: string, product: Product): Promise<any> {
    return new Promise (async (resolve, reject) => {
      const uid = this.uidService.getUid()
      if (!product.id) product.id = this.db.createPushId()
      const ref = this.fireStorage.ref(`products/${uid}/${product.id}`)
      const task = ref.putString( photo, 'base64', { contentType: 'image/jpeg'} )

      const p = new Promise ((resolver, rejecte) => {
        const task2 = task.snapshotChanges().pipe(
          finalize(async () => {
            const downloadURL = await ref.getDownloadURL().toPromise()
            task2.unsubscribe()
            product.url = downloadURL
            resolver(product)
          })
          ).subscribe(
            x => { },
            err => {
              rejecte(err)
            }
          )
      })
      resolve(p)
    })
  }

  sectionChange(oldSection: string, idProduct: string) {
    const uid = this.uidService.getUid()
    this.db.object(`principal/${uid}/products/${oldSection}/${idProduct}`).remove()
  }

  setProduct(product: Product) {
    return new Promise(async (resolve, reject) => {      
      try {
        const uid = this.uidService.getUid()
        await this.db.object(`principal/${uid}/products/${product.section}/${product.id}`).update(product)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  deleteProduct(product: Product) {
    return new Promise(async(resolve, reject) => {
      const uid = this.uidService.getUid()
      try{
        this.removePhoto(product.url)
        await this.db.object(`principal/${uid}/products/${product.section}/${product.id}`).remove()
        resolve()
      } catch(error) {
        reject(error)
      }
    });
  }

  removePhoto(photo: string) {
    return this.fireStorage.storage.refFromURL(photo).delete()
  }

}
