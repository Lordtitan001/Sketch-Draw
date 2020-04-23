import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { Draw } from '../../../../../common/communication/draw';
import { Drawing } from '../../../../../common/drawing';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { NewProjectService } from '../new-project/new-project.service';

const BASE_URL = 'http://localhost:3000/api/drawing/';

@Injectable({
  providedIn: 'root'
})

export class SaveDrawingService {
  drawing: Drawing;
  drawList: Draw[];
  message: string;
  constructor(
    private newService: NewProjectService,
    private drawService: DrawingServiceService,
    private http: HttpClient) {
    this.drawing = new Drawing();
    this.drawList = [];
    this.message = '';
  }

  saveDrawing(nom: string = 'Sans nom', tags: string[] = []): Observable<string> {
    this.drawing.nom = (nom === '') ? 'Sans nom' : nom;
    this.drawing.tags = tags;
    return this.http.post(BASE_URL, { Draw: this.drawing, Tags: tags }, { responseType: 'text' });

  }

  findDrawings(response: Draw[], tags: string[]): Draw[] {
    const tempArray: Draw[] = [];
    if (tags.length === 0) {
      return response;
    }
    response.forEach((value) => {
      value.Draw.tags.find((val) => {
        for (const tag of tags) {
          if (tag === val) {
            tempArray.push(value);
            return true;
          }
        }
        return false;
      });
    });
    return tempArray;
  }

  async getDrawing(tags: string[] = []): Promise<Draw[]> {
    return new Promise<Draw[]>((resolve, reject) => {
      this.getAllDrawings().then((response) => {
        this.drawList = response;
        resolve(this.findDrawings(this.drawList, tags));
      },
        (error) => {
          this.message = (error.status === 0) ? 'Erreur: Impossible d"etablir la connextion avec le serveur' :
          'Erreur: Impossible d"etablir la connextion avec la base de donnée';
          reject(this.findDrawings(this.drawList, tags));
        });
    });
  }

  async getAllDrawings(): Promise<Draw[]> {
    return new Promise<Draw[]>((resolve, reject) => {
      this.http.get<Draw[]>(BASE_URL) .subscribe((response) => { resolve(response); },
          (error) => { reject(error); }
        );
    });
  }

  setDrawing(): void {
    const svgDimensions: [string, string] =
      [this.drawService.elements.svg.getAttribute('width') as string, this.drawService.elements.svg.getAttribute('height') as string];
    this.drawing.svgDimensions = svgDimensions;
    const svg = this.drawService.elements.svg.cloneNode(true) as SVGSVGElement;
    svg.getElementById('grid').remove();
    svg.getElementById('preview').remove();
    this.drawing.prev = svg.innerHTML;
    this.drawing.backgroundColor = this.newService.backgroundColor;
    this.drawing.surfaceList = this.drawService.surfaceList;

  }

  async deleteDrawing(id: string): Promise<boolean> {
    return new Promise<boolean>(
      (resolve, reject) => {
        const URL = BASE_URL + '/' + id;
        this.http.delete<boolean>(URL, { responseType: 'json' })
        .subscribe( (res) => { resolve(res); }, (error: HttpErrorResponse) => { reject(error); }
        );
      });
  }
}
