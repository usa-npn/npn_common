import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {CacheService} from '../../common';

import {ObservationFrequencySelection} from './observation-frequency-selection';

@Injectable()
export class ObservationFrequencySelectionFactory {
    constructor(protected http: Http,protected cacheService: CacheService) {}

    newSelection(): ObservationFrequencySelection {
        return new ObservationFrequencySelection(this.http,this.cacheService);
    }
}
