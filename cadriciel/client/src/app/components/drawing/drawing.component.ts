import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { NewProjectService } from 'src/app/services/new-project/new-project.service';
import { SelectedToolService } from 'src/app/services/selected-tool/selected-tool.service';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})

export class DrawingComponent implements AfterViewInit {
  protected width: number;
  protected height: number;
  @ViewChild('preview', { static: false }) private preview: ElementRef;
  @ViewChild('selection', { static: false }) private selection: ElementRef;
  @ViewChild('svg', { static: false }) private svg: ElementRef;
  @ViewChild('controle', { static: false }) private controle: ElementRef;
  @ViewChild('eraser', { static: false }) private eraser: ElementRef;
  @ViewChild('canvas', { static: false }) private canvas: ElementRef;

  constructor(private drawService: DrawingServiceService,
              private newService: NewProjectService,
              private selecService: SelectedToolService,
              protected grid: GridService) {
    this.width = this.newService.modalData.width;
    this.height = this.newService.modalData.height;
  }

  ngAfterViewInit(): void {
    this.drawService.elements.domRect = this.preview.nativeElement as SVGElement;
    this.drawService.elements.svg = this.svg.nativeElement as SVGSVGElement;
    this.drawService.elements.selectionElement = this.selection.nativeElement as SVGPathElement;
    this.drawService.elements.controle = this.controle.nativeElement as SVGElement;
    this.drawService.elements.eraserElement = this.eraser.nativeElement as SVGElement;
    this.drawService.elements.canvas = this.canvas.nativeElement as HTMLCanvasElement;
  }

  @HostListener('document:keyup', ['$event'])
  protected keyUp(event: KeyboardEvent): void {
    this.selecService.getSelectService().keyUp(event);
  }

  @HostListener('document:keydown', ['$event'])
  protected keyDown(event: KeyboardEvent): void {
    this.selecService.getSelectService().keyDown(event);
  }

  protected mouseDblclick(event: MouseEvent): void {
    this.selecService.getSelectService().mouseDblclick(event);
  }

  protected mouseMove(event: MouseEvent): void {
    this.selecService.getSelectService().mouseMove(event);
  }
  protected mouseUp(event: MouseEvent): void {
    this.selecService.getSelectService().mouseUp(event);
  }
  protected mouseDown(event: MouseEvent): void {
    this.selecService.getSelectService().mouseDown(event);

  }
  protected mouseLeave(): void {
    this.selecService.getSelectService().mouseLeave();
  }
  protected mouseClick(event: MouseEvent): void {
    this.selecService.getSelectService().mouseClick(event);
  }
  protected mouseDownPath(event: MouseEvent): void {
    this.selecService.getSelectService().mouseDownPath(event);
  }
  protected mouseClickPath(event: MouseEvent): void {
    this.selecService.getSelectService().mouseClickPath(event);
  }
  protected mouseDownControle(event: MouseEvent): void {
    this.selecService.getSelectService().mouseDownControle(event);
  }
  mouseDownSelection(event: MouseEvent): void {
    this.selecService.getSelectService().mouseDownSelection(event);
  }
  protected mouseOverPath(event: MouseEvent): void {
    this.selecService.getSelectService().mouseOverPath(event);
  }
  protected mouseLeavePath(event: MouseEvent): void {
    this.selecService.getSelectService().mouseLeavePath(event);
  }
  protected mouseUpPath(event: MouseEvent): void {
    this.selecService.getSelectService().mouseUpPath(event);
  }
  protected mouseWheel(event: MouseEvent): void {
    this.selecService.getSelectService().mouseWheel(event);
  }
}
