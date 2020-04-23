import { TestBed } from '@angular/core/testing';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlService } from './form-control.service';

describe('FormControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [FormBuilder],
    imports: [ReactiveFormsModule, FormsModule]
  }));

  it('should be created', () => {
    const service: FormControlService = TestBed.get(FormControlService);
    expect(service).toBeTruthy();
  });
});
