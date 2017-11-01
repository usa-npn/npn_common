import {NpnServiceUtils} from '../../common';
import {StationAwareVisSelection,selectionProperty} from '../vis-selection';

// TODO is this always network wide or can they select specific stations
export class ObserverActivitySelection extends StationAwareVisSelection {
    @selectionProperty()
    year:number;

    constructor(protected serviceUtils:NpnServiceUtils) {
        super();
    }

    isValid():boolean {
        return !!this.year;
    }

    dataCnt:number = 0;
    getData():Promise<any> {
        // /npn_portal/networks/getObserversByMonth.json?year=2015&network_id=69
        let url = this.serviceUtils.apiUrl('/npn_portal/networks/getObserversByMonth.json'),
            params = {
                year: this.year,
                network_id: this.networkIds[0]
            };
        return new Promise((resolve,reject) => {
            this.serviceUtils.cachedGet(url,params)
                .then(data => {
                    let months = [1,2,3,4,5,6,7,8,9,10,11,12].map(i => {
                        return {...{month:i},...data.months[i]};
                    });
                    data.months = months;
                    resolve(data);
                })
                .catch(reject);
            /*
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
                let nobs = rint(0,10);
                response.months.push({
                    month: i,
                    //month_name: 'ignore',
                    number_new_observers: nobs,
                    number_active_observers: rint(nobs,20)
                });
            }
            resolve(response);
            */
        });
    }
}
