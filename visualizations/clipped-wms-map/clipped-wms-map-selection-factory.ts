import {Injectable} from '@angular/core';

import {Http} from '@angular/http';
import {CacheService} from '../../common';

import {ClippedWmsMapSelection} from './clipped-wms-map-selection';

@Injectable()
export class ClippedWmsMapSelectionFactory {
    constructor(protected http: Http,protected cacheService: CacheService) {}
s
    newSelection(): ClippedWmsMapSelection {
        return new ClippedWmsMapSelection(this.http,this.cacheService);
    }
}
