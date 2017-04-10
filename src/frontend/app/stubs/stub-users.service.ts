import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

export const UsersModel = [];
for (let i = 0; i < 10; i++) {
  UsersModel.push({
    id: i.toString(),
    username: 'user_' + i,
    email: 'user_ ' + i + '@test.fr',
  });
}

@Injectable()
export class StubUsersService {
    constructor(private http: AuthHttp) { }

    all(parameters?: any) {
        return Observable.of(UsersModel);
    }
}
