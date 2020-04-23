import { TestBed } from '@angular/core/testing';
import { Subject } from 'src/app/Models/interfaces';
import { UserManualService } from './user-manual.service';
// tslint:disable no-magic-numbers
describe('UserManualService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [UserManualService]
  }));

  it('should be created', () => {
    const service: UserManualService = TestBed.get(UserManualService);
    expect(service).toBeTruthy();
  });

  it('selectSubject should select a subject', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    const subject: Subject = { name: 'Bonjour', text: 'Bonsoir', img: '', index: 0, category: 0 , explication: ''};

    service.selectSubject(subject);

    expect(service.subject).toBe(subject);
    expect(service.categoryIndex).toBe(subject.category);
    expect(service.currentIndex).toBe(subject.index);
  });

  it('next should select the next subject in the next category', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    const subjects1: Subject[] = [{ name: 'A1', text: 'A2', img: '', index: 0, category: 0 , explication: ''},
    { name: 'B1', text: 'B2', img: '', index: 1, category: 0 , explication: ''}];

    const subjects2: Subject[] = [{ name: 'C1', text: 'C2', img: '', index: 0, category: 1, explication: '' },
    { name: 'D1', text: 'D2', img: '', index: 1, category: 1, explication: '' },
    { name: 'E1', text: 'E2', img: '', index: 2, category: 1, explication: ''}];

    const categories: Subject[][] = [subjects1, subjects2];
    service.categories = categories;

    service.selectSubject(subjects1[1]);
    service.nextSubject(categories);

    expect(service.subject).toBe(subjects2[0]);
  });

  it('next should select the next subject in the same category', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    const subjects1: Subject[] = [{ name: 'A1', text: 'A2', img: '', index: 0, category: 0, explication: '' },
    { name: 'B1', text: 'B2', img: '', index: 1, category: 0, explication: '' }];

    const subjects2: Subject[] = [{ name: 'C1', text: 'C2', img: '', index: 0, category: 1, explication: '' },
    { name: 'D1', text: 'D2', img: '', index: 1, category: 1, explication: '' },
    { name: 'E1', text: 'E2', img: '', index: 2, category: 1, explication: '' }];

    const categories: Subject[][] = [subjects1, subjects2];
    service.categories = categories;

    service.selectSubject(subjects1[0]);
    service.nextSubject(categories);

    expect(service.subject).toBe(subjects1[1]);
  });

  it('next should open the tools ', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    service.selectSubject(service.subjectCategories.none[3]);
    service.nextSubject(service.categories);

    expect(service.isShow.isShowTools).toBe(false);
  });

  it('next should open the forms ', () => {
    const service: UserManualService = TestBed.get(UserManualService);
    service.selectSubject(service.subjectCategories.tools[6]);
    service.nextSubject(service.categories);

    expect(service.isShow.isShowForms).toBe(false);
  });

  it('next should open the selections ', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    service.selectSubject(service.subjectCategories.forms[2]);
    service.nextSubject(service.categories);

    expect(service.isShow.isShowSelections).toBe(false);
  });

  it('next should open the exportations ', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    service.selectSubject(service.subjectCategories.selections[3]);
    service.nextSubject(service.categories);

    expect(service.isShow.isShowExportations).toBe(false);
  });

  it('previous should select the previous subject in the same category', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    const subjects1: Subject[] = [{ name: 'A1', text: 'A2', img: '', index: 0, category: 0, explication: '' },
    { name: 'B1', text: 'B2', img: '', index: 1, category: 0, explication: '' }];

    const subjects2: Subject[] = [{ name: 'C1', text: 'C2', img: '', index: 0, category: 1, explication: '' },
    { name: 'D1', text: 'D2', img: '', index: 1, category: 1, explication: '' },
    { name: 'E1', text: 'E2', img: '', index: 2, category: 1, explication: '' }];

    const categories: Subject[][] = [subjects1, subjects2];
    service.categories = categories;

    service.selectSubject(subjects2[0]);
    service.previousSubject(categories);

    expect(service.subject).toBe(subjects1[1]);
  });

  it('previous should select the previous subject in the same previous category', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    const subjects1: Subject[] = [{ name: 'A1', text: 'A2', img: '', index: 0, category: 0, explication: '' },
    { name: 'B1', text: 'B2', img: '', index: 1, category: 0, explication: '' }];

    const subjects2: Subject[] = [{ name: 'C1', text: 'C2', img: '', index: 0, category: 1, explication: '' },
    { name: 'D1', text: 'D2', img: '', index: 1, category: 1, explication: '' },
    { name: 'E1', text: 'E2', img: '', index: 2, category: 1, explication: '' }];

    const categories: Subject[][] = [subjects1, subjects2];
    service.categories = categories;

    service.selectSubject(subjects2[2]);
    service.previousSubject(categories);

    expect(service.subject).toBe(subjects2[1]);
  });

  it('previous should open the tools ', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    service.selectSubject(service.subjectCategories.forms[0]);
    service.previousSubject(service.categories);

    expect(service.isShow.isShowTools).toBe(false);
  });

  it('previous should open the forms ', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    service.selectSubject(service.subjectCategories.selections[0]);
    service.previousSubject(service.categories);

    expect(service.isShow.isShowForms).toBe(false);
  });

  it('previous should open the selections', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    service.selectSubject(service.subjectCategories.exportations[0]);
    service.previousSubject(service.categories);

    expect(service.isShow.isShowSelections).toBe(false);
  });

  it('previous should open the selections ', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    service.selectSubject(service.subjectCategories.selections[3]);
    service.nextSubject(service.categories);

    expect(service.isShow.isShowExportations).toBe(false);
  });

  it('hidePrevious should return true depending on the position where we suppose to be', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    const subjects1: Subject[] = [{ name: 'A1', text: 'A2', img: '', index: 0, category: 0, explication: '' },
    { name: 'B1', text: 'B2', img: '', index: 1, category: 0, explication: '' }];

    const subjects2: Subject[] = [{ name: 'C1', text: 'C2', img: '', index: 0, category: 1, explication: '' },
    { name: 'D1', text: 'D2', img: '', index: 1, category: 1, explication: '' },
    { name: 'E1', text: 'E2', img: '', index: 2, category: 1, explication: '' }];

    const categories: Subject[][] = [subjects1, subjects2];
    service.categories = categories;

    service.selectSubject(subjects1[0]);

    expect(service.hidePreviousButtun()).toBe(false);
  });

  it('hideNext should return true depending on the position where we suppose to be', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    const subjects1: Subject[] = [{ name: 'A1', text: 'A2', img: '', index: 0, category: 0, explication: '' },
    { name: 'B1', text: 'B2', img: '', index: 1, category: 0, explication: '' }];

    const subjects2: Subject[] = [{ name: 'C1', text: 'C2', img: '', index: 0, category: 1, explication: '' },
    { name: 'D1', text: 'D2', img: '', index: 1, category: 1, explication: '' },
    { name: 'E1', text: 'E2', img: '', index: 2, category: 1, explication: '' }];

    const categories: Subject[][] = [subjects1, subjects2];
    service.categories = categories;

    service.selectSubject(subjects2[2]);

    expect(service.hideNextButtun()).toBe(false);
  });

  it('toogleDisplay should open or close tools', () => {
    const service: UserManualService = TestBed.get(UserManualService);

    service.toogleDisplay(1);

    expect(service.isShow.isShowTools).toBe(false);
  });

  it('toogleDisplay should open or close forms', () => {
    const service: UserManualService = TestBed.get(UserManualService);
    service.toogleDisplay(2);

    expect(service.isShow.isShowForms).toBe(false);
  });

  it('toogleDisplay should open or close exportations', () => {
    const service: UserManualService = TestBed.get(UserManualService);
    service.toogleDisplay(4);

    expect(service.isShow.isShowExportations).toBe(false);
  });

  it('toogleDisplay should open or close slections', () => {
    const service: UserManualService = TestBed.get(UserManualService);
    service.toogleDisplay(3);
    expect(service.isShow.isShowSelections).toBe(false);
  });

  it('toogleDisplay should open  all my categories', () => {
    const service: UserManualService = TestBed.get(UserManualService);
    service.toogleDisplay(5);
    expect(service.isShow.isShowSelections).toBe(true);
    expect(service.isShow.isShowExportations).toBe(true);
    expect(service.isShow.isShowForms).toBe(true);
    expect(service.isShow.isShowTools).toBe(true);
  });

});
