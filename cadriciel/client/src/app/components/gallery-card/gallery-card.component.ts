import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Color } from 'src/app/Models/color';
import { SaveProperty } from 'src/app/Models/interfaces';
import { Path } from 'src/app/Models/shapes/path';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { GalleryServiceService } from 'src/app/services/gallery-service/gallery-service.service';
import { NewProjectService } from 'src/app/services/new-project/new-project.service';
import { UndoRedoService } from 'src/app/services/undoRedo/undo-redo.service';
import { Draw } from '../../../../../common/communication/draw';

const xDimensions = 300;
const yDimensions = 150;

@Component({
  selector: 'app-gallery-card',
  templateUrl: './gallery-card.component.html',
  styleUrls: ['./gallery-card.component.scss']
})
export class GalleryCardComponent implements OnInit, AfterViewInit {
  @Input() protected drawing: Draw;
  @ViewChild('preview', { static: false }) private preview: ElementRef;
  @ViewChild('previewSVG', { static: false }) private previewSVG: ElementRef;
  protected property: SaveProperty;
  private message: string;
  private action: string;

  constructor(private drawService: DrawingServiceService,
              private galleryService: GalleryServiceService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router,
              private newService: NewProjectService,
              private undoRedoService: UndoRedoService
  ) {
    this.action = 'Ok';
    this.message = '';
  }

  ngAfterViewInit(): void {
    (this.preview.nativeElement as SVGElement).innerHTML = this.drawing.Draw.prev;
    const color = this.drawing.Draw.backgroundColor as Color;
    (this.previewSVG.nativeElement as SVGSVGElement)
    .setAttribute('style',  `background-color: rgba(${color.redValue}, ${color.greenValue}, ${color.blueValue}, ${color.opacityValue});`);
  }

  ngOnInit(): void {
    this.property = {
      scaleX: xDimensions / parseInt(this.drawing.Draw.svgDimensions[0], 10),
      scaleY: yDimensions / parseInt(this.drawing.Draw.svgDimensions[1], 10),
      transform: '',
      svgStyle: {}
    };
    this.property.transform = `scale(${this.property.scaleX} ${this.property.scaleY})`;
  }

  protected deleteDrawing(): void {
    this.message =  'Voulez vous vraiment suprimmer ce dessin ?';
    const toExecute = async () => {
      this.galleryService.docLoaded = Promise.resolve(false);
      await this.galleryService.deleteDrawing(this.drawing._id).then(
        () => {
          this.message =  'Supprimé avec succes';
          this.galleryService.docLoaded = Promise.resolve(true);
        },
        (reject: HttpErrorResponse) => {
          this.message = 'Impossible de supprimer: ';
          this.message += (reject.status === 0) ? 'Serveur déconnecté' : 'Base de donnée déconnectée';
          this.galleryService.docLoaded = Promise.resolve(true);
      }).then(() => {
        this.galleryService.openPopUp(() => { this.snackBar.dismiss(); },  this.message, this.action);
      });
    };

    this.galleryService.openPopUp(toExecute, this.message, this.action);
  }

  protected continueDrawing(): void {
    const loadDrawing = () => {
      this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
        this.router.navigate(['home']);
      });
      Object.setPrototypeOf(this.drawing.Draw.backgroundColor, Color.prototype);
      this.drawing.Draw.surfaceList.forEach((path) => {
        Object.setPrototypeOf(path, Path.prototype);
      });
      this.drawService.surfaceList = this.drawing.Draw.surfaceList;
      this.drawService.indexList = this.drawing.Draw.surfaceList.length - 1;
      const dimension =  this.drawing.Draw.svgDimensions;
      this.newService.modalData.width = parseInt(dimension[0], 10);
      this.newService.modalData.height = parseInt(dimension[1], 10);
      const color = this.drawing.Draw.backgroundColor;
      this.newService.backgroundColor = new Color(color.redValue, color.greenValue, color.blueValue, color.opacityValue);
      this.undoRedoService.initOnLoad();
      this.dialog.closeAll();
      this.snackBar.dismiss();
    };

    if (!(this.drawService.surfaceList.length > 0)) {
      loadDrawing();
      return;
    }

    const action = 'Continuer';
    const message = 'Votre action effacera le dessin en cours';
    this.galleryService.openPopUp(loadDrawing, message, action);

  }

}
