import {Component,Input,Output,EventEmitter} from '@angular/core';

import {Species} from '../../common';
import {ActivityCurve,ACTIVITY_CURVE_KINGDOM_METRICS} from './activity-curve';
import {ActivityCurvesSelection} from './activity-curves-selection';

@Component({
    selector: 'curve-selection-control',
    template: `
    <species-phenophase-input [(species)]="curve.species" [(phenophase)]="curve.phenophase" [selection]="selection">
    </species-phenophase-input>

    <md-select class="year-input" placeholder="Year" [(ngModel)]="curve.year">
        <md-option *ngFor="let y of validYears" [value]="y">{{y}}</md-option>
    </md-select>

    <md-select class="metric-input" placeholder="Metric" [(ngModel)]="curve.metric" [disabled]="!curve.validMetrics.length">
        <md-option *ngFor="let m of curve.validMetrics" [value]="m">{{m.label}}</md-option>
    </md-select>
    `,
    styles: [`
        .metric-input {
            width: 310px;
        }
    `]
})
export class CurveControlComponent {
    @Input()
    selection: ActivityCurvesSelection;
    @Input()
    curve: ActivityCurve;

    validYears:number[] = (function() {
        let thisYear = (new Date()).getFullYear(),
            years: number[] = [],
            c = 2010;
        while(c < thisYear) {
            years.push(c++);
        }
        return years;
    })();
}
