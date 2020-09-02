import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AnimationsService } from 'src/app/services/animations.service';

import { MainProfile } from 'src/app/interfaces/profile.interface';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss'],
})
export class SecondComponent implements OnInit {

  @Input() profile: MainProfile;
  @Output() social = new EventEmitter<string>();
  @Output() contact = new EventEmitter<string>();

  constructor(
    private animationService: AnimationsService,
  ) { }

  ngOnInit() {}

  ionImgWillLoad(image) {
    this.animationService.enterAnimation(image.target)
  }

  emit(action: string) {
    this.contact.emit(action)
  }

  goPage(page: string) {
    this.social.emit(page);
  }

}
