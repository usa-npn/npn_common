import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {DatePipe} from '@angular/common';
import {CacheService} from '../../common';

import {ActivityCurvesSelection} from './activity-curves-selection';

@Injectable()
export class ActivityCurvesSelectionFactory {
    constructor(protected http: Http,protected cacheService: CacheService,protected datePipe: DatePipe) {}

    newSelection(): ActivityCurvesSelection {
        return new ActivityCurvesSelection(this.http,this.cacheService,this.datePipe);
    }
}
