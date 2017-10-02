import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {CacheService} from '../../common';

import {ScatterPlotSelection} from './scatter-plot-selection';

@Injectable()
export class ScatterPlotSelectionFactory {
    constructor(protected http: Http,protected cacheService: CacheService) {}

    newSelection(): ScatterPlotSelection {
        return new ScatterPlotSelection(this.http,this.cacheService);
    }
}
