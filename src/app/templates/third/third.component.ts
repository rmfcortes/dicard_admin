import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainProfile } from 'src/app/interfaces/profile.interface';

@Component({
  selector: 'app-third',
  templateUrl: './third.component.html',
  styleUrls: ['./third.component.scss'],
})
export class ThirdComponent implements OnInit {

  @Input() profile: MainProfile
  @Output() social = new EventEmitter<string>()
  @Output() contact = new EventEmitter<string>()

  noImage = '../../../assets/img/no-image-cover.png'

  constructor() { }

  ngOnInit() {}

  emit(action: string) {
    this.contact.emit(action)
  }

  goPage(page: string) {
    this.social.emit(page);
  }

}
