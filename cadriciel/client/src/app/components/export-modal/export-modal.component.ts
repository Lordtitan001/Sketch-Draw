import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { EmailService } from 'src/app/services/email/email.service';
import { ExportationService } from 'src/app/services/exportation/exportation.service';
import { FormControlService } from 'src/app/services/from-control/form-control.service';
import { GalleryServiceService } from 'src/app/services/gallery-service/gallery-service.service';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss']
})

export class ExportModalComponent {

  protected scale: string;

  @ViewChild('canvas', { static: false }) private canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('select', { static: false }) private select: ElementRef<HTMLAnchorElement>;
  @ViewChild('filter', { static: false }) private filter: ElementRef<HTMLSelectElement>;
  @ViewChild('extension', { static: false }) private extension: ElementRef<HTMLSelectElement>;
  @ViewChild('svgRef', { static: false }) private svgRef: ElementRef<SVGSVGElement>;

  constructor(private exported: ExportationService,
              private drawService: DrawingServiceService,
              private dialogRef: MatDialogRef<ExportModalComponent>,
              private formService: FormControlService,
              private emailService: EmailService,
              private galleryService: GalleryServiceService
  ) {
    this.scale = `0 0 ${this.drawService.elements.svg.getAttribute('width')} ${this.drawService.elements.svg.getAttribute('height')}`;
  }

  ngAfterViewInit(): void {
    this.svgRef.nativeElement.innerHTML = this.drawService.elements.svg.innerHTML;
    this.svgRef.nativeElement.style.background = this.drawService.elements.svg.style.background;
    this.exported.svg = this.svgRef.nativeElement;
    this.exported.canvas = this.canvas.nativeElement;
    this.exported.select = this.select.nativeElement;
    this.exported.filter = this.filter.nativeElement;
    this.exported.extension = this.extension.nativeElement;
    this.exported.onInit();
  }

  protected async save(): Promise<void> {
    await this.exported.svgToImage(false);
    this.dialogRef.close();
  }

  protected onSendClick(): void {
    const email = this.exported.export.email.toString();
    const imageName = this.exported.export.fileName.toString();
    this.exported.svgToImage(true).then((data) => {
      const emailData = { to: email, data, extension: this.exported.extension.value, name: imageName };
      this.emailService.sendEmail(emailData)
        .subscribe((res) => {
          this.galleryService.openPopUp(() => { return; }, res.message, '');
        },
          (reject) => {
            this.galleryService.openPopUp(() => { return; }, 'Probleme de connexion avec le serveur', '');
          }
        );
    });

    this.dialogRef.close();
    this.exported.reset();
  }

  protected onValueChange(): void {
    this.exported.previewStyle = `url(#${this.exported.applyFilter()})`;
  }

  protected canSend(): boolean {
    const value = this.formService.formGroup.get('email') as AbstractControl;
    return !(value.hasError(this.formService.errorMessages.email[0].type) || value.hasError(this.formService.errorMessages.email[1].type));
  }

  ngOnDestroy(): void {
    this.exported.reset();
  }

}
