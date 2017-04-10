import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

export const USER_MODEL = {
    username: 'yannick.raffin',
    email: 'yannick.raffin@modisfrance.fr'
};

@Injectable()
export class StubAccountService {
    constructor(private http: AuthHttp) { }

    getUserInfo() {
        return Observable.of(USER_MODEL);
    }
}
