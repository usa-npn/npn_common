import {Injectable,Inject} from '@angular/core';
import {Http} from '@angular/http';
import {DatePipe} from '@angular/common';
import {CacheService,NpnConfiguration,NPN_CONFIGURATION} from '../../common';

import {ActivityCurvesSelection} from './activity-curves-selection';

@Injectable()
export class ActivityCurvesSelectionFactory {
    constructor(protected http: Http,
                protected cacheService: CacheService,
                protected datePipe: DatePipe,
                @Inject(NPN_CONFIGURATION) private config:NpnConfiguration) {}

    newSelection(): ActivityCurvesSelection {
        return new ActivityCurvesSelection(this.http,this.cacheService,this.datePipe,this.config);
    }
}
