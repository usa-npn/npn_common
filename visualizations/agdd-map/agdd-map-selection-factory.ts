import {Injectable} from '@angular/core';

import {Http} from '@angular/http';
import {CacheService} from '../../common';

import {AgddMapSelection} from './agdd-map-selection';

@Injectable()
export class AgddMapSelectionFactory {
    constructor(protected http: Http,protected cacheService: CacheService) {}

    newSelection(): AgddMapSelection {
        return new AgddMapSelection(this.http,this.cacheService);
    }
}
