import {Location} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserManualService } from 'src/app/services/user-manual/user-manual.service';

const toogle = 5;
@Component({
  selector: 'app-user-manual',
  templateUrl: './user-manual.component.html',
  styleUrls: ['./user-manual.component.scss']
})
export class UserManualComponent  implements OnInit {

  constructor(private usermanualService: UserManualService, public location: Location) {

  }
  ngOnInit(): void {
    this.usermanualService.selectSubject(this.usermanualService.subjectCategories.none[0]);
    this.usermanualService.toogleDisplay(toogle);
  }

  protected backClicked(): void {
    this.location.back();
  }

}
