import {Component,Input,Output,EventEmitter} from '@angular/core';

import {Species} from '../../common';
import {ActivityCurve,ACTIVITY_CURVE_KINGDOM_METRICS} from './activity-curve';
import {ActivityCurvesSelection} from './activity-curves-selection';

@Component({
    selector: 'curve-selection-control',
    template: `
    <species-phenophase-input [(species)]="curve.species" [(phenophase)]="curve.phenophase" [selection]="selection">
    </species-phenophase-input>

    <mat-form-field class="year-input">
        <mat-select placeholder="Year" [(ngModel)]="curve.year">
            <mat-option *ngFor="let y of validYears" [value]="y">{{y}}</mat-option>
        </mat-select>
    </mat-form-field>

    <mat-form-field class="metric-input">
        <mat-select placeholder="Metric" [(ngModel)]="curve.metric" [disabled]="!curve.validMetrics.length">
            <mat-option *ngFor="let m of curve.validMetrics" [value]="m">{{m.label}}</mat-option>
        </mat-select>
    </mat-form-field>
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
