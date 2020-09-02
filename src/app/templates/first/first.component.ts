import { Component, Input, Output, EventEmitter } from '@angular/core';

import { MainProfile } from 'src/app/interfaces/profile.interface';


@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss'],
})
export class FirstComponent {

  @Input() profile: MainProfile;
  @Output() social = new EventEmitter<string>();
  @Output() contact = new EventEmitter<string>();

  noImage = '../../../assets/img/no-image-cover.png'
  noImageAvatar = '../../../assets/img/no-image-avatar.png'

  constructor(
  ) { }

    // Actions

  emit(action: string) {
    this.contact.emit(action)
  }

  goPage(page: string) {
    this.social.emit(page);
  }


}
