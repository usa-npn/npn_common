import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {CacheService,NetworkService} from '../../common';

import {ObservationFrequencySelection} from './observation-frequency-selection';

@Injectable()
export class ObservationFrequencySelectionFactory {
    constructor(protected http: Http,protected cacheService: CacheService,protected networkService: NetworkService) {}

    newSelection(): ObservationFrequencySelection {
        return new ObservationFrequencySelection(this.http,this.cacheService,this.networkService);
    }
}
