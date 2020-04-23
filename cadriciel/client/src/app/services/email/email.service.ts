import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailData } from '../../../../../common/communication/draw';

const BASE_URL = 'http://localhost:3000/api/email/';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) {
  }

  sendEmail(mailData: EmailData): Observable<{message: string}> {
    return this.http.post<{message: string}>(BASE_URL, {emailData: mailData });
  }
}
