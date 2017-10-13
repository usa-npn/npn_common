import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {CacheService} from '../../common';

import {ObserverActivitySelection} from './observer-activity-selection';

@Injectable()
export class ObserverActivitySelectionFactory {
    constructor(protected http: Http,protected cacheService: CacheService) {}

    newSelection(): ObserverActivitySelection {
        return new ObserverActivitySelection(this.http,this.cacheService);
    }
}
