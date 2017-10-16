import {Http} from '@angular/http';
import {CacheService} from '../../common';
import {StationAwareVisSelection,selectionProperty} from '../vis-selection';

// TODO is this always network wide or can they select specific stations
export class ObserverActivitySelection extends StationAwareVisSelection {
    @selectionProperty()
    year:number;

    constructor(protected http: Http,protected cacheService: CacheService) {
        super();
    }

    isValid():boolean {
        return !!this.year;
    }

    dataCnt:number = 0;
    getData():Promise<any> {
        return new Promise(resolve => {
            // mocked up randomly generated response
            let response:any = {
                network_id: this.networkIds[0],
                months: []
            },
            rint = (min,max) => {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max-min)) + min;
            };
            // mock up a bogus response
            // every other return a full year and then a partial year
            let max = 13;
            if(this.year === (new Date()).getFullYear()) {
                // if it's this year then return up to this month
                max = (new Date()).getMonth()+2
            }
            for(let i = 1; i < max; i++) {
                response.months.push({
                    month: i,
                    //month_name: 'ignore',
                    number_new_observers: rint(0,20),
                    number_active_observers: rint(0,30)
                });
            }
            /* doesn't make sense since the vis can calculate and doesn't include the
               parallel active sum.
            response.annual_number_new_observers = response.months.reduce((sum,month) => {
                return sum+month.number_new_observers;
            },0);*/
            console.log(`${JSON.stringify(response)}`);
            resolve(response);
        });
    }
}
