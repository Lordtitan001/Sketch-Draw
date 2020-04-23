import * as axios from 'axios';
import * as FormData from 'form-data';
import { injectable } from 'inversify';
import { EmailData } from '../../../common/communication/draw';

const MAIL_API = 'https://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true';

@injectable()
export class EmailService {

  async getData(emailData: EmailData): Promise<axios.AxiosResponse<object>> {

    const buff = Buffer.from(emailData.data, 'base64');
    const form = new FormData();
    form.append('to', emailData.to);
    form.append('payload', buff, `${emailData.name}.${emailData.extension}`);

    return axios.default.post(MAIL_API, form, { headers: { ...form.getHeaders({ 'X-Team-Key': process.env.KEY_MAIL }) } });
  }

}
