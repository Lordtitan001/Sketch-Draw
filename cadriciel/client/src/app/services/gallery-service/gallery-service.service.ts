import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { isNullOrUndefined } from 'util';
import { Draw } from '../../../../../common/communication/draw';
import { SaveDrawingService } from '../saveDrawing/save-drawing.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryServiceService {

  tagList: string[];
  tagSelected: string[];
  docLoaded: Promise<boolean>;
  drawList: Draw[];
  private action: string;
  private message: string;
  constructor(private saveService: SaveDrawingService,
              private snackBar: MatSnackBar) {
    this.tagList = [];
    this.tagSelected = [];
    this.docLoaded = Promise.resolve(false);
    this.action = '';
    this.message = '';
  }

  init(): void {
    this.tagSelected = [];
    this.getAllImageFromDataBase().
      then(async () => {
          return Promise.resolve(true);
        }
      );
  }

  private filter(drawList: Draw[]): void {
    this.tagList = [];
    const tagSet = new Set<string>();
    for (const value of drawList) {
      value.Draw.tags.forEach((tag) => {
      });
    }
    tagSet.forEach((tag) => {
    });
  }

  async getAllImageFromDataBase(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.docLoaded = Promise.resolve(false);
      this.saveService.getDrawing(this.tagSelected)
        .then(async (value) => {
          this.drawList = value;
          this.checkDrawing();
          resolve(true);
          return Promise.resolve(true);
        }, async (value) => {
          this.drawList = value;
          this.openPopUp(this.snackBar.dismiss, this.saveService.message, this.action);
          return Promise.resolve(true);
        })
        .then(async () => {
          this.docLoaded = Promise.resolve(true);
          return Promise.resolve(true);
        });
    });
  }

  async deleteDrawing(id: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.saveService.deleteDrawing(id)
        .then(async (res) => {
          await this.getAllImageFromDataBase();
          resolve(res);
        }, (error) => {
          reject(error);
        });
    });
  }

  openPopUp(toExecute: CallableFunction, message: string, action: string): void {
    this.snackBar.openFromComponent(PopupComponent, {
      duration: 2000,
      data: {
        action,
        message,
        function: toExecute
      }
    });
  }

  private checkDrawing(): void {
    if (isNullOrUndefined(this.drawList[0])) {
      this.message = 'Aucun dessin trouvé';
      this.openPopUp(this.snackBar.dismiss, this.message, this.action);
    }
  }

}
