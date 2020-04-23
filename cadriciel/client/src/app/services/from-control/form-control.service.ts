import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorMessages } from 'src/app/Models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  errorMessages: ErrorMessages;
  formGroup: FormGroup;
  constructor(public formBuilder: FormBuilder) {
    this.errorMessages = {
      width: [
        { type: 'required', message: 'Une taille est requise' },
        { type: 'min', message: 'La taille minimum est de 0' },
      ],
      height: [
        { type: 'required', message: 'Une taille est requise' },
        { type: 'min', message: 'La taille minimum est de 0' },
      ],
      RGB: [
        { type: 'pattern', message: "Le format d'entrer est incorrect" },
      ],
      author: [
        { type: 'required', message: 'Un auteur est requis' }
      ],
      email: [
        { type: 'required', message: 'Une adresse courriel est requise' },
        { type: 'email', message: "L'adresse courriel n'est pas valide" }
      ]
    };
    this.formGroup = this.formBuilder.group(
      {
        width: new FormControl(2,
          Validators.compose([
            Validators.required,
            Validators.min(0),
          ])),
        height: new FormControl(2,
          Validators.compose([
            Validators.required,
            Validators.min(0),
          ])),

        RGB: new FormControl('000000',
          Validators.compose([
            Validators.required,
            Validators.pattern('([A-Fa-f0-9]{6})$')

          ])),
        email: new FormControl('',
          Validators.compose([
            Validators.required,
            Validators.email
          ])),
      });
  }
}
