import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

// import { I18nModel } from '../i18n/i18n.model';

export const I18n_MODEL = [
    { code: 'core.login', value: 'Login' }
];

@Injectable()
export class StubI18nService {
    constructor(private http: Http, private authHttp: AuthHttp) { }

    getKeys(platform: string, term?: string) {
        return Observable.of(I18n_MODEL);
    }

    updateKey(platform: string, model: any) {
        return Observable.of(model);
    }
}
