import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {CacheService} from '../../common';

import {ActivityCurvesSelection} from './activity-curves-selection';

@Injectable()
export class ActivityCurvesSelectionFactory {
    constructor(protected http: Http,protected cacheService: CacheService) {}

    newSelection(): ActivityCurvesSelection {
        return new ActivityCurvesSelection();
    }
}
