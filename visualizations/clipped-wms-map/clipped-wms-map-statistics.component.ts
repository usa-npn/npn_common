import {Component, Input, OnInit} from '@angular/core';

import { ClippedWmsMapSelection } from './clipped-wms-map-selection';

const COUNT_TT = 'Number of pixels included in the calculations';

const SIX_TOOLTIPS = {
    count: COUNT_TT,
    mean: 'Mean day of year of the onset of the first leaf index for the pixels displayed',
    stdDev: 'The standard deviation of the mean day of year of the onset of the first leaf index for the pixels displayed',
    min: 'Minimum day of year of the onset of the first leaf index for the pixels displayed',
    max: 'Maximum day of year of the onset of the first leaf index for the pixels displayed',
    complete: 'Percent of pixels that have reached the requirements for the Spring Index.'
};
const AGDD_TOOLTIPS = {
    count: COUNT_TT,
    mean: 'Mean Accumulated Growing Degree Day value for the pixels displayed',
    stdDev: 'The standard deviation of the Accumulated Growing Degree Day value for the pixels displayed',
    min: 'Minimum Accumulated Growing Degree Day value for the pixels displayed',
    max: 'Maximum Accumulated Growing Degree Day value for the pixels displayed'
};
@Component({
    selector: 'clipped-wms-map-statistics',
    template: `
    <table *ngIf="statistics">
        <tbody>
            <tr><td>Date</td><td>{{statistics.date | date:'longDate'}}</td></tr>
            <tr [matTooltip]="tooltips['count']"><td>Count</td><td>{{statistics.count}}</td></tr>
            <tr [matTooltip]="tooltips['mean']"><td>Mean</td><td>{{statistics.mean | number:'1.3-3'}}</td></tr>
            <tr [matTooltip]="tooltips['stdDev']"><td>Std Dev</td><td>{{statistics.stddev | number:'1.3-3'}}</td></tr>
            <tr [matTooltip]="tooltips['min']"><td>Min</td><td>{{statistics.min  | number:'1.0-3'}}</td></tr>
            <tr [matTooltip]="tooltips['max']"><td>Max</td><td>{{statistics.max  | number:'1.0-3'}}</td></tr>
            <tr *ngIf="!gdd" [matTooltip]="tooltips['complete']"><td>Complete</td><td>{{statistics.percentComplete | number:'1.0-2'}}%</td></tr>
        </tbody>
    </table>
    `,
    styles:[`
        :host {
            line-height: 12px;
        }
        tr td:first-of-type {
            font-weight: bold;
            text-align: right;
            padding-right: 5px;
        }
        tr td:first-of-type:after {
            content: ':';
        }
    `]
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
            this.tooltips = this.gdd ? AGDD_TOOLTIPS : SIX_TOOLTIPS;
        }
    }
}
