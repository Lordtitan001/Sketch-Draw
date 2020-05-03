import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AutoSaveService } from 'src/app/services/autoSave/auto-save.service';
import { ColorPickerService } from 'src/app/services/color-picker/color-picker.service';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { DrawingModalComponent } from '../drawing-modal/drawing-modal.component';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
  selector: 'app-entry-point',
  templateUrl: './entry-point.component.html',
  styleUrls: ['./entry-point.component.scss']
})
export class EntryPointComponent {
  private name: string;
  protected isModalOpen: boolean;
  constructor(
    private dialog: MatDialog,
    protected drawService: DrawingServiceService,
    protected autoSave: AutoSaveService,
    private router: Router,
    private pickerService: ColorPickerService
  ) {
    this.isModalOpen = false;
    this.name = 'Sans titre';
  }

  protected continue(): void {
    this.router.navigate(['home']);
  }
  protected navigate(path: string): void {
    this.router.navigate([path]);
  }

  protected openGalleryModal(): void {
    if (!this.drawService.isModalOpen) {
      this.dialog.closeAll();
      this.drawService.isModalOpen = true;
      this.dialog.open(GalleryComponent, {
        hasBackdrop: true,
        width: '800px',
        height: '800px',
        panelClass: 'custom-gallery-container'
      });

      this.dialog.afterAllClosed.subscribe(() => {
        this.drawService.isModalOpen = false;
      });
    }

  }

  protected openDrawingModal(): void {
    if (!this.drawService.isModalOpen) {
      this.dialog.closeAll();
      this.drawService.isModalOpen = true;
      this.pickerService.isTool = false;
      this.dialog.open(DrawingModalComponent, {
        width: '30%',
        data: { name: this.name }
      });

      this.dialog.afterAllClosed.subscribe(() => {
        this.pickerService.isTool = true;
        this.drawService.isModalOpen = false;
      });
    }
  }

  @HostListener('document:keydown', ['$event'])
  protected keyDown(event: KeyboardEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
      if (event.code === 'KeyO') {
        this.openDrawingModal();
      } else if (event.code === 'KeyG') {
        this.openGalleryModal();
      }
    }
  }

}
