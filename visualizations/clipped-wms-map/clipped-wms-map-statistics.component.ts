import {Component, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { ClippedWmsMapSelection, ClippedLayerDef } from './clipped-wms-map-selection';

// wraps DecimalPipe and supplies custom formatting for specific layers for mean/min/max
@Pipe({
    name: 'clippedStatValue'
})
export class ClippedStatValuePipe implements PipeTransform {
    constructor(private decimalPipe:DecimalPipe) {}
    transform(value:any,nFormat:string,layer:ClippedLayerDef):any {
        if(layer && layer.layerName === 'si-x:leaf_anomaly') {
            let transformed = this.decimalPipe.transform(Math.abs(value),nFormat);
            if(value < 0) {
                return `${transformed} days early`;
            } else {
                return `${transformed} days late`;
            }
        }
        return this.decimalPipe.transform(value,nFormat);
    }
}

const COUNT_TT = 'Number of pixels included in the calculations';
const SIX_COMPLETE = 'Percent of pixels that have reached the requirements for the Spring Index.';
const AGDD_COMPLETE = 'Maximum Accumulated Growing Degree Day value for the pixels displayed';

const SIX_TOOLTIPS = {
    count: COUNT_TT,
    mean: 'Mean day of year of the onset of the first leaf index for the pixels displayed',
    stdDev: 'The standard deviation of the mean day of year of the onset of the first leaf index for the pixels displayed',
    min: 'Minimum day of year of the onset of the first leaf index for the pixels displayed',
    max: 'Maximum day of year of the onset of the first leaf index for the pixels displayed',
    complete: SIX_COMPLETE
};
const AGDD_TOOLTIPS = {
    count: COUNT_TT,
    mean: 'Mean Accumulated Growing Degree Day value for the pixels displayed',
    stdDev: 'The standard deviation of the Accumulated Growing Degree Day value for the pixels displayed',
    min: 'Minimum Accumulated Growing Degree Day value for the pixels displayed',
    max: AGDD_COMPLETE
};
const SIX_ANOMALY_TOOLTIPS = {
    count: COUNT_TT,
    mean: 'Mean number of days different from a long-term average (1981-2010) for the pixels displayed',
    stdDev: 'The standard deviation of the mean number of days different from a long-term average (1981-2010) for the pixels displayed',
    min: 'Earliest day compared to a long-term average (1981-2010) for the pixels displayed',
    max: 'Latest day compared to a long-term average (1981-2010) for the pixels displayed',
    complete: SIX_COMPLETE
};
const AGDD_ANOMALY_TOOLTIPS = {
    count: COUNT_TT,
    mean: 'Mean Growing Degree Day difference from a long-term average (1981-2010) for the pixels displayed',
    stdDev: 'The standard deviation of the mean Growing Degree Day difference from a long-term average (1981-2010) for the pixels displayed',
    min: 'Lowest Growing Degree Day compared to a long-term average (1981-2010) for the pixels displayed',
    max: 'Highest Growing Degree Day compared to a long-term average (1981-2010) for the pixels displayed',
    complete: AGDD_COMPLETE
};
@Component({
    selector: 'clipped-wms-map-statistics',
    template: `
    <table *ngIf="statistics" [ngClass]="{'no-data': statistics.count === 0}">
        <tbody>
            <tr><td>Date</td><td>{{statistics.date | date:'longDate'}}</td></tr>
            <tr *ngIf="statistics.count !== 0" [matTooltip]="tooltips['count']"><td>Count</td><td>{{statistics.count}}</td></tr>
            <tr *ngIf="statistics.count !== 0" [matTooltip]="tooltips['mean']"><td>Mean</td><td>{{statistics.mean | clippedStatValue:'1.3-3':selection.layer}}</td></tr>
            <tr *ngIf="statistics.count !== 0" [matTooltip]="tooltips['stdDev']"><td>Std Dev</td><td>{{statistics.stddev | number:'1.3-3'}}</td></tr>
            <tr *ngIf="statistics.count !== 0" [matTooltip]="tooltips['min']"><td>Min</td><td>{{statistics.min  | clippedStatValue:'1.0-3':selection.layer}}</td></tr>
            <tr *ngIf="statistics.count !== 0" [matTooltip]="tooltips['max']"><td>Max</td><td>{{statistics.max  | clippedStatValue:'1.0-3':selection.layer}}</td></tr>
            <tr *ngIf="!gdd && statistics.count !== 0" [matTooltip]="tooltips['complete']"><td>Complete</td><td>{{statistics.percentComplete | number:'1.0-2'}}%</td></tr>
            <tr><td *ngIf="statistics.count === 0 && selection.layer.noDataDisclaimer" colspan="2" class="no-data-disclaimer">{{selection.layer.noDataDisclaimer}}</td></tr>
        </tbody>
    </table>
    `,
    styles:[`
        :host {
            line-height: 12px;
        }
        table.no-data {
            max-width: 250px;
        }
        tr td:first-of-type {
            font-weight: bold;
            text-align: right;
            padding-right: 5px;
        }
        tr td:first-of-type:after {
            content: ':';
        }
        tr td.no-data-disclaimer {
            text-align: center;
        }
        tr td.no-data-disclaimer:after {
            content: '';
        }
    `],
    providers: [ClippedStatValuePipe]
})
export class ClippedWmsMapStatisticsComponent {
    @Input()
    selection:ClippedWmsMapSelection;

    statistics:any;
    gdd:boolean;
    tooltips:any;

    ngDoCheck() {
        if(this.selection && this.selection.data && this.selection.data.statistics) {
            this.statistics = this.selection.data.statistics;
            this.gdd = this.selection && /^gdd/.test(this.selection.layer.layerName);
            this.tooltips = this.gdd ?
                (this.selection.layer.id === 'anomaly' ? AGDD_ANOMALY_TOOLTIPS : AGDD_TOOLTIPS) :
                (this.selection.layer.id === 'anomaly' ? SIX_ANOMALY_TOOLTIPS : SIX_TOOLTIPS);
        }
    }
}
