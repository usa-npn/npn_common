import {NpnServiceUtils,NetworkService} from '../../common';
import {StationAwareVisSelection,selectionProperty} from '../vis-selection';

// TODO is this always network wide or can they select specific stations
export class ObservationFrequencySelection extends StationAwareVisSelection {
    @selectionProperty()
    year:number;

    constructor(protected serviceUtils:NpnServiceUtils,protected networkService: NetworkService) {
        super();
    }

    isValid():boolean {
        return !!this.year && this.networkIds.length === 1;
    }

    dataCnt:number = 0;
    getData():Promise<any> {
        return new Promise((resolve,reject) => {
            let url = this.serviceUtils.apiUrl('/npn_portal/networks/getSiteVisitFrequency.json'),
                params = {
                    year: this.year,
                    network_id: this.networkIds[0]
                };
            this.serviceUtils.cachedGet(url,params)
                .then(data => {
                    // massage data collapsing maps into simple arrays
                    data.stations = Object.keys(data.stations).map(key => data.stations[key]);
                    data.stations.forEach(s => {
                        let arr = [1,2,3,4,5,6,7,8,9,10,11,12].map(i => s.months[i]);
                        s.months = arr;
                    });
                    resolve(data);
                })
                .catch(reject);

        });
    }
}
