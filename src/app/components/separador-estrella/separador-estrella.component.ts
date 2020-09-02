import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-separador-estrella',
  templateUrl: './separador-estrella.component.html',
  styleUrls: ['./separador-estrella.component.scss'],
})
export class SeparadorEstrellaComponent implements OnInit {

  @Input() src

  constructor() { }

  ngOnInit() {
  }

}
