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
        let url = this.serviceUtils.apiUrl('/npn_portal/networks/getSiteVisitFrequency.json'),
            params = {
                year: this.year,
                network_id: this.networkIds[0]
            };
        return this.serviceUtils.cachedGet(url,params);
    }
}
