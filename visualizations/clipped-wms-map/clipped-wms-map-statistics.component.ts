import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'clipped-wms-map-statistics',
    template: `
    <table>
        <tbody>
            <tr><td>Date</td><td>{{statistics.date | date:'longDate'}}</td></tr>
            <tr><td>Count</td><td>{{statistics.count}}</td></tr>
            <tr><td>Mean</td><td>{{statistics.mean | number:'1.3-3'}}</td></tr>
            <tr><td>Std Dev</td><td>{{statistics.stddev | number:'1.3-3'}}</td></tr>
            <tr><td>Min</td><td>{{statistics.min}}</td></tr>
            <tr><td>Max</td><td>{{statistics.max}}</td></tr>
            <tr><td>Complete</td><td>{{statistics.percentComplete | number:'1.0-2'}}%</td></tr>
        </tbody>
    </table>
    `,
    styles:[`
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
    statistics: any;
}
