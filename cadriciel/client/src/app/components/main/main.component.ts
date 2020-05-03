import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { EnumElement, EnumTool } from 'src/app/Models/enums';
import { Style, StyleIcon, WindowSize } from 'src/app/Models/interfaces';
import { AutoSaveService } from 'src/app/services/autoSave/auto-save.service';
import { ColorPickerService } from 'src/app/services/color-picker/color-picker.service';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { GalleryServiceService } from 'src/app/services/gallery-service/gallery-service.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { MagnetsimService } from 'src/app/services/magnetsim/magnetsim.service';
import { MapService } from 'src/app/services/maps/map.service';
import { NewProjectService } from 'src/app/services/new-project/new-project.service';
import { SelectedToolService } from 'src/app/services/selected-tool/selected-tool.service';
import { SelectionMoveService } from 'src/app/services/selection-move/selection-move.service';
import { UndoRedoService } from 'src/app/services/undoRedo/undo-redo.service';
import { DrawingModalComponent } from '../drawing-modal/drawing-modal.component';
import { ExportModalComponent } from '../export-modal/export-modal.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { SaveModalComponent } from '../save-modal/save-modal.component';

const barSize = 50;
const sideMenuSize = 350;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {

  protected color: string;
  protected ngStyle: Style;
  private closeSideMenu: boolean;
  protected isOpen: boolean;
  private selectedElement: EnumElement;
  private lastElement: EnumElement;
  protected code: string;
  private mapElement: Map<EnumElement, StyleIcon>;
  private gridSelected: boolean;
  protected themeIcon: string;
  protected iconMagnet: string;
  constructor(
    private dialog: MatDialog,
    private newService: NewProjectService,
    public drawService: DrawingServiceService,
    private colorPicker: ColorPickerService,
    private selectionService: SelectionMoveService,
    private selecService: SelectedToolService,
    private router: Router,
    private undoRedoService: UndoRedoService,
    private gridService: GridService,
    private mapService: MapService,
    private autoSave: AutoSaveService,
    private magnetService: MagnetsimService,
    private galleryService: GalleryServiceService
  ) {
    this.mapElement = new Map<EnumElement, StyleIcon>();
    this.mapElement.set(EnumElement.Shape, { background: 'none' });
    this.mapElement.set(EnumElement.Tool, { background: 'none' });
    this.mapElement.set(EnumElement.undo, { background: 'none' });
    this.mapElement.set(EnumElement.redo, { background: 'none' });
    this.mapElement.set(EnumElement.Grid, { background: 'none' });
    this.ngStyle = {
      currentBarStyle: {},
      currentMenuStyle: {},
      currentSvgStyle: {},
    };
    this.drawService.selectTool();
    this.themeIcon = (document.documentElement.style.getPropertyValue('--primary') === 'black') ? 'brightness_3' : 'brightness_5';
    this.ngStyle.currentSvgStyle.left = `${barSize}px`;
    this.ngStyle.currentSvgStyle.width = `${window.innerWidth - barSize}px`;
    this.ngStyle.currentSvgStyle.height = '100%';
    this.iconMagnet = 'dashboard';

    this.ngStyle.currentMenuStyle.display = 'none';
    this.color = 'black';
    this.closeSideMenu = true;
    this.isOpen = false;
    this.selectedElement = EnumElement.Any;
    this.lastElement = EnumElement.Any;
    this.code = '';
    this.setSVGStyle({ width: window.innerWidth - barSize, height: window.innerHeight });
    this.gridSelected = false;

    this.newService.windowsEvent.subscribe((value) => {
      this.setSVGStyle(value);
    });
    let themeIcon = this.autoSave.setUxDisplay();
    themeIcon = themeIcon === '' ? this.themeIcon : themeIcon;
    this.themeIcon = themeIcon;
    this.switchTeme();
    this.autoSave.saveUxDisplay(this.themeIcon);
  }

  private setSVGStyle(value: WindowSize): void {
    this.ngStyle.currentSvgStyle.left = this.closeSideMenu ? `${barSize}px` : `${sideMenuSize}px`;
    this.ngStyle.currentSvgStyle.overflow = 'auto';
    this.ngStyle.currentSvgStyle.backgroundColor = `${this.newService.backgroundColor.inverseColor().getColor()}`;
    this.ngStyle.currentSvgStyle.position = 'fixed';
    this.ngStyle.currentSvgStyle.zIndex = '3';
    this.ngStyle.currentSvgStyle.width = this.closeSideMenu ? `${value.width}px` : `${value.height}px`;
    this.ngStyle.currentSvgStyle.height = '100%';

  }

  protected newPage(): void {
    this.openDialog(this.drawService.surfaceList.length > 0);
  }

  private openDialog(dirty: boolean): void {
    if (!this.drawService.isModalOpen) {
      this.drawService.isModalOpen = true;
      this.colorPicker.isTool = false;
      this.dialog.closeAll();
      this.selecService.selectedService.reset();
      this.dialog.open(DrawingModalComponent, {
        width: '35%',
        hasBackdrop: true,
        data: {
          name: '',
          color: '',
          width: window.innerWidth - barSize,
          height: window.innerHeight,
          isDirty: dirty,
          isCreated: false
        }
      });

      this.dialog.afterAllClosed.subscribe((res) => {
        this.colorPicker.isTool = true;
        this.drawService.isModalOpen = false;
      });
    }
  }

  protected openSaveModal(): void {
    if (!this.drawService.isModalOpen) {
      this.selecService.selectedService.reset();
      this.dialog.closeAll();
      this.drawService.isModalOpen = true;
      this.dialog.open(SaveModalComponent, {
        width: '35%',
        hasBackdrop: true,
      });

      this.dialog.afterAllClosed.subscribe((res) => {
        this.drawService.isModalOpen = false;
      });
    }
  }

  protected openGalleryModal(): void {
    if (!this.drawService.isModalOpen) {
      this.dialog.closeAll();
      this.selecService.selectedService.reset();
      this.drawService.isModalOpen = true;
      this.dialog.open(GalleryComponent, {
        hasBackdrop: true,
        width: '800px',
        height: '800px',
        panelClass: 'custom-gallery-container'
      });

      this.dialog.afterAllClosed.subscribe((res) => {
        this.drawService.isModalOpen = false;
      });
    }
  }

  @HostListener('document:keydown', ['$event'])
  protected keyDown(e: KeyboardEvent): void {
    if (e.ctrlKey) {
      e.preventDefault();
      switch (e.code) {
        case 'KeyO':
          this.openDialog(this.drawService.surfaceList.length > 0);
          break;
        case 'KeyZ':
          if (e.shiftKey) {
            if (this.undoRedoService.actions.redoList.length - 1 !== 0) {
              this.undoRedoService.redo();
            }
          } else if (this.undoRedoService.actions.lastActionsList.length - 1 !== 0) {
            this.undoRedoService.undo();
          }
          break;
        case 'KeyS':
          this.openSaveModal();
          break;
        case 'KeyE':
          this.openExportModal();
          break;
        case 'KeyG':
          this.openGalleryModal();
          break;
      }
      return;
    }
    this.testKeyEvent(e);

  }

  ngOnInit(): void {
    if (!this.undoRedoService.isNew) {
      this.galleryService.openPopUp(() => { }, this.autoSave.date, '');
    }
  }

  private testKeyEvent(e: KeyboardEvent): void {
    if (e.code === 'KeyG' && !this.drawService.isModalOpen) {
      if (this.gridSelected === false) {
        this.gridSelected = true;
        this.gridService.makeGrid();
        return;
      }

      this.drawService.grid.gridContent = '';
      this.gridSelected = false;
      this.drawService.grid.gridImage = 'grid_off';
      return;
    }

    if (e.code === 'KeyM' && !this.drawService.isModalOpen) {
      this.magnetService.isActive = ! this.magnetService.isActive;
      this.iconMagnet = (this.iconMagnet === 'view_module') ? 'dashboard' : 'view_module';
      return;
    }
    const test = (e.key === '-' || e.key === '+') && this.gridSelected;
    if (test) {
      this.gridService.changeSize(e);
      return;
    }

    this.drawService.keyDown(e).then((value) => {
      if (value) {
        this.selectElementWithKey();
      }
    });
  }

  protected getIconStyle(element: EnumElement): StyleIcon {
    if (this.selectedElement === element) {
      this.resetSyle();
      this.mapElement.set(element, { background: 'var(--primary)' });
    }
    return this.mapElement.get(element) as StyleIcon;
  }

  private resetSyle(): void {
    this.mapElement.forEach((value, key) => {
      value.background = 'none';
    });
  }

  private setNavStyle(): void {

    this.closeSideMenu = (this.lastElement === this.selectedElement &&
      this.lastElement !== EnumElement.Any) ? true : false;
    this.selectedElement = this.closeSideMenu ? EnumElement.Any : this.selectedElement;
    this.lastElement = this.selectedElement;
    this.ngStyle.currentSvgStyle.left = this.closeSideMenu ? `${barSize}px` : `${sideMenuSize}px`;
    this.ngStyle.currentSvgStyle.overflow = 'auto';
    this.ngStyle.currentSvgStyle.backgroundColor = `${this.newService.backgroundColor.inverseColor().getColor()}`;
    this.ngStyle.currentSvgStyle.position = 'fixed';
    this.ngStyle.currentSvgStyle.zIndex = '3';
    this.ngStyle.currentSvgStyle.width = this.closeSideMenu ? `${window.innerWidth - barSize}px` : `${window.innerWidth - sideMenuSize}px`,
    this.ngStyle.currentSvgStyle.height = '100%';
    this.ngStyle.currentSvgStyle.transition = ' 0.5s';

    this.ngStyle.currentMenuStyle.width = this.closeSideMenu ? '0px' : `${sideMenuSize - barSize}px`;
    this.ngStyle.currentMenuStyle.display = this.closeSideMenu ? 'none' : 'block';

    this.ngStyle.currentBarStyle.width = this.closeSideMenu ? `${barSize}px` : `${sideMenuSize}px`,

    this.selectionService.side = this.closeSideMenu ? barSize : sideMenuSize;
    this.selectTool();
    this.getIconStyle(this.selectedElement);
  }

  protected selectTool(): void {
    if (this.selectedElement === EnumElement.Shape) {
      this.mapService.mapIcon.forEach((value, key) => {
        if (value === this.drawService.images.imageShapeSelected) {
          this.drawService.enumTool = key;
          this.drawService.selectTool();
          return true;
        }
        return false;
      });
      return;
    }

    this.mapService.mapIcon.forEach((value, key) => {
      if (value === this.drawService.images.imageToolSelected) {
        this.drawService.enumTool = key;
        this.drawService.selectTool();
        return true;
      }
      return false;
    });
  }

  protected switchTeme(): void {
    if (this.themeIcon === 'brightness_3') {
      this.themeIcon = 'brightness_5';
      document.documentElement.style.setProperty('--primary', 'rgba(196, 166, 228, 0.38)');
      document.documentElement.style.setProperty('--secondary', 'rgba(158, 130, 167, 0.2)');
      document.documentElement.style.setProperty('--text', 'black');
      document.documentElement.style.setProperty('--matCard', 'white');
      this.autoSave.saveUxDisplay(this.themeIcon);
      return;
    }
    this.themeIcon = 'brightness_3';
    document.documentElement.style.setProperty('--primary', 'black');
    document.documentElement.style.setProperty('--secondary', 'rgba(0,0,0,.62)');
    document.documentElement.style.setProperty('--text', 'white');
    document.documentElement.style.setProperty('--matCard', 'rgba(0,0,0,.62)');
    this.autoSave.saveUxDisplay(this.themeIcon);
  }

  protected selectElementWithKey(): void {
    const tool = this.drawService.enumTool;
    const test = (tool === EnumTool.Line || tool === EnumTool.Rectangle) || tool === EnumTool.Polygone || tool === EnumTool.Ellipse;
    if (test) {
      this.selectedElement = EnumElement.Shape;
      this.getIconStyle(EnumElement.Shape);
      return;
    }
    this.selectedElement = EnumElement.Tool;
    this.getIconStyle(EnumElement.Tool);
  }

  protected selectElement(type: number): void {
    this.selectedElement = type;
    this.setNavStyle();
  }

  protected openUserManual(): void {
    this.router.navigate(['manual']);
  }

  protected openExportModal(): void {
    if (!this.drawService.isModalOpen) {
      this.selecService.selectedService.reset();
      this.dialog.closeAll();
      this.drawService.isModalOpen = true;
      this.dialog.open(ExportModalComponent, {
        width: '850px',
        hasBackdrop: true,
      });

      this.dialog.afterAllClosed.subscribe((res) => {
        this.drawService.isModalOpen = false;
      });
    }
  }

  protected helpChanged(): void {
    this.mapService.helpChecked = !this.mapService.helpChecked;
    this.autoSave.saveUxDisplay(this.themeIcon);
  }

}

