import {Http} from '@angular/http';
import {CacheService,NetworkService} from '../../common';
import {StationAwareVisSelection,selectionProperty} from '../vis-selection';

// TODO is this always network wide or can they select specific stations
export class ObservationFrequencySelection extends StationAwareVisSelection {
    @selectionProperty()
    year:number;

    constructor(protected http: Http,protected cacheService: CacheService,protected networkService: NetworkService) {
        super();
    }

    isValid():boolean {
        return !!this.year && this.networkIds.length === 1;
    }

    dataCnt:number = 0;
    getData():Promise<any> {
        return new Promise((_resolve,_reject) => {
            this.working = true;
            let resolve = (d?) => {
                    this.working = false;
                    _resolve(d);
                },
                reject = (e?) => {
                    this.working = false;
                    _reject(e);
                },
                rint = (min,max) => {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max-min)) + min;
                };
            this.networkService.getStations(this.networkIds[0])
                .then(stations => {
                    let response = {
                        network_id: this.networkIds[0],
                        year: this.year,
                        stations: stations.map(s => {
                            let d = {
                                station_id: s.station_id,
                                station_name: s.station_name,
                                months: []
                            };
                            let max = 13;
                            if(this.year === (new Date()).getFullYear()) {
                                // if it's this year then return up to this month
                                max = (new Date()).getMonth()+2
                            }
                            for(let i = 1; i < max; i++) {
                                d.months.push({
                                    month: i,
                                    number_site_visits: rint(0,10)
                                });
                            }
                            return d;
                        })
                    };
                    resolve(response);
                })
                .catch(reject);
        });
    }
}
