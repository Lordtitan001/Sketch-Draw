import { Injectable } from '@angular/core';
import { Show, Subject, SubjectCategories } from 'src/app/Models/interfaces';

import data from 'src/app/JSONDATA/guideData.json';
import { CategorieSegmentation, CategoryEnum, Index } from 'src/app/Models/enums';

@Injectable({
  providedIn: 'root'
})

export class UserManualService {
  subject: Subject;
  currentIndex: number;
  categoryIndex: number;

  isShow: Show;

  subjectCategories: SubjectCategories;
  categories: Subject[][];
  list: { description: string, name: string, img: string, explication: string }[] = data;

  constructor() {
    this.isShow = {
      isShowTools: true, isShowExportations: true, isShowForms: true,
      isShowSelections: true
    };
    this.subjectCategories = {
      none: [],
      tools: [],
      forms: [],
      selections: [],
      exportations: []
    };
    this.fillCategory(this.subjectCategories.none, CategorieSegmentation.NoneBegin, CategorieSegmentation.NoneEnd, CategoryEnum.NONE);
    this.fillCategory(this.subjectCategories.tools, CategorieSegmentation.ToolsBegin, CategorieSegmentation.ToolsEnd, CategoryEnum.TOOLS);
    this.fillCategory(this.subjectCategories.forms, CategorieSegmentation.FormsBegin, CategorieSegmentation.FormsEnd, CategoryEnum.FORMS);
    this.fillCategory(this.subjectCategories.selections, CategorieSegmentation.SelectionsBegin
      , CategorieSegmentation.SelectionsEnd, CategoryEnum.SELECTIONS);
    this.fillCategory(this.subjectCategories.exportations, CategorieSegmentation.ExportationBegin,
      CategorieSegmentation.ExportationEnd, CategoryEnum.EXPORTATION);
    this.categories = [
      this.subjectCategories.none,
      this.subjectCategories.tools,
      this.subjectCategories.forms,
      this.subjectCategories.selections,
      this.subjectCategories.exportations
    ];
  }

  fillCategory(cat: Subject[], startIndex: number, endIndex: number, categoryNum: number): void {
    let iteration = 0;
    for (let i = startIndex; i <= endIndex; i++) {
      cat.push({
        name: this.list[i].name, text: this.list[i].description, img: this.list[i].img, index: iteration,
        category: categoryNum, explication: this.list[i].explication
      });
      iteration++;
    }

  }
  selectSubject(subject: Subject): void {
    this.subject = subject;
    this.currentIndex = subject.index;
    this.categoryIndex = subject.category;
  }

  nextSubject(categories: Subject[][]): void {

    let line = this.currentIndex + 1;
    let column = this.categoryIndex;
    if (categories[column].length === line) {
      line = 0;
      column++;
    }
    this.selectSubject(categories[column][line]);

    switch (this.categoryIndex) {

      case Index.One:
        this.isShow.isShowTools = false;
        break;
      case Index.Two:
        this.isShow.isShowForms = false;
        break;
      case Index.Three:
        this.isShow.isShowSelections = false;
        break;
      case Index.Four:
        this.isShow.isShowExportations = false;
        break;
      default:
        break;
    }

  }

  previousSubject(categories: Subject[][]): void {
    let line = this.currentIndex - 1;
    let column = this.categoryIndex;
    const canPass: boolean = line < 0;

    if (canPass) {
      column--;
      line = categories[column].length - 1;
    }

    this.selectSubject(categories[column][line]);

    switch (this.categoryIndex) {

      case Index.One:
        this.isShow.isShowTools = false;
        break;
      case Index.Two:
        this.isShow.isShowForms = false;
        break;
      case Index.Three:
        this.isShow.isShowSelections = false;
        break;

      default:
        break;
    }

  }

  hidePreviousButtun(): boolean {
    return this.subject !== this.categories[0][0];
  }
  hideNextButtun(): boolean {
    return this.subject !== this.categories[this.categories.length - 1]
    [this.categories[this.categories.length - 1].length - 1];
  }

  toogleDisplay(position: number): void {
    switch (position) {

      case Index.One:
        this.isShow.isShowTools = !this.isShow.isShowTools;
        break;
      case Index.Two:
        this.isShow.isShowForms = !this.isShow.isShowForms;
        break;
      case Index.Three:
        this.isShow.isShowSelections = !this.isShow.isShowSelections;
        break;

      case Index.Four:
        this.isShow.isShowExportations = !this.isShow.isShowExportations;
        break;
      case Index.Five:
        this.isShow.isShowTools = true;
        this.isShow.isShowForms = true;
        this.isShow.isShowSelections = true;
        this.isShow.isShowExportations = true;

    }
  }

}
