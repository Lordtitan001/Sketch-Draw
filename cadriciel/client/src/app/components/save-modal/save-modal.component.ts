import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent, MatDialog, MatSnackBar } from '@angular/material';
import { Chip, SaveData, SaveProperty, Spinner } from 'src/app/Models/interfaces';
import { GalleryServiceService } from 'src/app/services/gallery-service/gallery-service.service';
import { SaveDrawingService } from 'src/app/services/saveDrawing/save-drawing.service';
import { Drawing } from '../../../../../common/drawing';

const enterKeyCode = 13;
const spaceKeyCode = 32;
const valueSpin = 20;
const max = 10;
const widthSVG = 300;
const heightSVG = 240;
const errorStatus = 200;
@Component({
  selector: 'app-save-modal',
  templateUrl: './save-modal.component.html',
  styleUrls: ['./save-modal.component.scss']
})

export class SaveModalComponent implements OnInit, AfterViewInit {

  @ViewChild('previewSvg', { static: false }) private previewSvg: ElementRef;

  private saveData: SaveData;
  private currentDrawing: Drawing;
  protected chip: Chip;
  protected saveProp: SaveProperty;
  protected isSaving: Promise<boolean>;
  protected spin: Spinner;

  constructor(private saveService: SaveDrawingService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private galeryService: GalleryServiceService) {
    this.spin = {
      value: valueSpin,
      mode: 'indeterminate',
      color: 'accent'
    };
    this.saveData = {
      name: '',
      message: '',
      tags: []
    };

    this.chip = {
      isAddButtonOn: true,
      visible: true,
      selectable: true,
      removable: true,
      addOnBlur: true,
      separatorKeysCodes: [enterKeyCode, spaceKeyCode]
    };

    this.saveService.setDrawing();
    this.currentDrawing = this.saveService.drawing;
    this.isSaving = Promise.resolve(false);

    this.saveProp = {
      scaleX: 1,
      scaleY: 1,
      transform: '',
      svgStyle: {
        'background-color': `${this.currentDrawing.backgroundColor.getColor()}`,
        'width': '100%',
        'height': '100%'
      }
    };
  }

  ngOnInit(): void {
    const width = parseInt(this.currentDrawing.svgDimensions[0], 10);
    const height = parseInt(this.currentDrawing.svgDimensions[1], 10);
    this.saveProp.scaleX = widthSVG / width;
    this.saveProp.scaleY = heightSVG / height;
    this.saveProp.transform = `scale(${this.saveProp.scaleX} ${this.saveProp.scaleY})`;
  }

  ngAfterViewInit(): void {
    (this.previewSvg.nativeElement as SVGElement).innerHTML = this.currentDrawing.prev;
  }

  protected save(): void {
    let message = '';
    const action = '';
    this.isSaving = Promise.resolve(true);
    this.saveService.saveDrawing(this.saveData.name, this.saveData.tags)
      .subscribe(
        (value) => {
          message = 'sauvegarder avec succes';
          this.afterSave(message, action);
        },
        (error: HttpErrorResponse) => {
          if (error.status === 0) {
            message = 'Erreur de sauvegarde: Impossible d"etablir la connextion avec le serveur';
          } else if (error.status === errorStatus) {
            message = 'Erreur de sauvegarde: Impossible d"etablir la connextion avec la base de donnée';
          }
          this.afterSave(message, action);
        });
  }

  private afterSave(message: string, action: string): void {
    this.galeryService.openPopUp(this.snackBar.dismiss, message, action);
    this.isSaving = Promise.resolve(false);
  }
  protected checkTag(tag: string): boolean {
    let test = true;
    if (this.saveData.tags.length > max) {
      this.saveData.message = 'Nombre maximum de tags atteint';
      test = false;
    }
    if (tag.length > max) {
      this.saveData.message = "Règles d'étiquettes non respectées";
      test = false;

    }
    for (const newTag of this.saveData.tags) {
      if (newTag === tag) {
        this.saveData.message = 'Etiquette deja saisie';
        test = false;
      }
    }
    if (tag === '') {
      return false;
    }
    const action = 'Ok';
    !test ? this.galeryService.openPopUp(this.snackBar.dismiss, this.saveData.message, action)
      : this.saveData.message = '';
    return test;
  }

  protected add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (this.checkTag(value)) {
      this.saveData.tags.push(value.trim());
    }
    input.value = '';
  }

  protected remove(tag: string): void {
    const index = this.saveData.tags.findIndex((value) => value === tag);
    if (index >= 0) {
      this.saveData.tags.splice(index, 1);
    }
  }

  protected addChip(tag: string): void {
    const index = this.saveData.tags.findIndex((value) => value === tag);
    (-index === 1) ? this.saveData.tags.push(tag) : this.saveData.tags.splice(index, 1);
  }

  protected close(): void {
    this.dialog.closeAll();
  }

}
