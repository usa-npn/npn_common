import {Component, Input, OnInit} from '@angular/core';

import { ClippedWmsMapSelection } from './clipped-wms-map-selection';

@Component({
    selector: 'clipped-wms-map-statistics',
    template: `
    <table *ngIf="statistics">
        <tbody>
            <tr><td>Date</td><td>{{statistics.date | date:'longDate'}}</td></tr>
            <tr><td>Count</td><td>{{statistics.count}}</td></tr>
            <tr><td>Mean</td><td>{{statistics.mean | number:'1.3-3'}}</td></tr>
            <tr><td>Std Dev</td><td>{{statistics.stddev | number:'1.3-3'}}</td></tr>
            <tr><td>Min</td><td>{{statistics.min  | number:'1.0-3'}}</td></tr>
            <tr><td>Max</td><td>{{statistics.max  | number:'1.0-3'}}</td></tr>
            <tr *ngIf="!gdd"><td>Complete</td><td>{{statistics.percentComplete | number:'1.0-2'}}%</td></tr>
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

    ngDoCheck() {
        if(this.selection && this.selection.data && this.selection.data.statistics) {
            this.statistics = this.selection.data.statistics;
            this.gdd = this.selection && /^gdd/.test(this.selection.layer.layerName);
        }
    }
}
