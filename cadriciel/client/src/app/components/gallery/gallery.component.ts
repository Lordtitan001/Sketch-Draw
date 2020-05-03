import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Spinner } from 'src/app/Models/interfaces';
import { GalleryServiceService } from 'src/app/services/gallery-service/gallery-service.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  protected spinner: Spinner;

  constructor(private galleryService: GalleryServiceService, private matDialog: MatDialog) {
    this.galleryService.init();
    this.galleryService.docLoaded = Promise.resolve(false);
    this.spinner = {
      color: 'accent',
      mode: 'indeterminate',
      value: 50
    };
  }

  protected selectTag(tag: string): void {
    const index = this.galleryService.tagSelected.findIndex((value) => value === tag);
    (-index === 1) ? this.galleryService.tagSelected.push(tag) : this.galleryService.tagSelected.splice(index, 1);
    this.galleryService.getAllImageFromDataBase();
  }

  protected close(): void {
    this.matDialog.closeAll();
  }

}
