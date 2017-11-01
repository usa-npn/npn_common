import {Injectable,Inject} from '@angular/core';

import {DatePipe} from '@angular/common';
import {Http} from '@angular/http';
import {CacheService,NpnConfiguration,NPN_CONFIGURATION} from '../../common';
import {WmsMapLegendService} from '../../gridded';

import {ClippedWmsMapSelection} from './clipped-wms-map-selection';

@Injectable()
export class ClippedWmsMapSelectionFactory {
    constructor(protected http: Http,
                protected cacheService: CacheService,
                protected datePipe: DatePipe,
                protected mapLegendService:WmsMapLegendService,
                @Inject(NPN_CONFIGURATION) private config:NpnConfiguration) {}

    newSelection(): ClippedWmsMapSelection {
        return new ClippedWmsMapSelection(this.http,this.cacheService,this.datePipe,this.mapLegendService,this.config);
    }
}
