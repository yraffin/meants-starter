import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

export const LanguagesModel = [];
for (let i = 0; i < 10; i++) {
  LanguagesModel.push({
    id: i.toString(),
    name: 'language_' + i,
    flag: 'flag_' + i,
    culture: 'culture_' + i
  });
}

@Injectable()
export class StubLanguagesService {
    constructor(private http: AuthHttp) { }

    all(parameters?: any) {
        return Observable.of(LanguagesModel);
    }
}
