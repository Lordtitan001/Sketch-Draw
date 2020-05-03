import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { PopUpData } from 'src/app/Models/interfaces';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  protected popUpData: PopUpData;
  constructor(@Inject(MAT_SNACK_BAR_DATA) private data: PopUpData) {
    this.popUpData = this.data;
  }

}
