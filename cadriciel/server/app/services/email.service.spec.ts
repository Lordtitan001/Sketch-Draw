// tslint:disable no-magic-numbers
// tslint:disable no-string-literal
import { expect } from 'chai';
import 'reflect-metadata';
import { EmailData } from '../../../common/communication/draw';
import { testingContainer } from '../../test/test-utils';
import types from '../types';
import { EmailService } from './email.service';

describe('DrawingService', () => {
    let service: EmailService;
    beforeEach(async () => {
        const [container] = await testingContainer();
        service = container.get<EmailService>(types.EmailService);
    });

    it('should create the buffer and call post request and succed', () => {
        const emailData: EmailData = {
            to: 'kleumassi1@gmail.com',
            data: '',
            extension: 'jpg',
            name: 'image'
        };

        service.getData(emailData)
        .then((res) => {
            expect(res.status).equal(202);
        })
        .catch((err) => {
            expect(err.response.status).equal(422);
        });
    });

    it('should create the buffer and call post request and throw an error', () => {
        const emailData: EmailData = {
            to: '',
            data: '',
            extension: 'jpg',
            name: 'image'
        };

        service.getData(emailData)
        .catch((err) => {
            expect(err.response.status).equal(422);
        });
    });

});
