import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

export const StatsModel = [];
for (let i = 0; i < 10; i++) {
  StatsModel.push({
    username: 'user_' + i,
    fullname: 'User ' + i,
    nbConnections: i * 5,
    averageTime: i * 2,
    hits: i * 8
  });
}

@Injectable()
export class StubStatisticsService {
    constructor(private http: AuthHttp) { }

    getTotalStatistics(parameters?: any) {
        return Observable.of({ count: StatsModel.length });
    }

    getStatistics(parameters?: any) {
        return Observable.of(StatsModel);
    }

    getStatisticsByContext(type: String, parameters?: any) {
        return Observable.of(StatsModel);
    }
}
