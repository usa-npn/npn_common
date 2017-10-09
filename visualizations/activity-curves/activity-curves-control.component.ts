import {Component,Input} from '@angular/core';

import {INTERPOLATE} from './activity-curve';
import {ActivityCurvesSelection,ActivityFrequency,ACTIVITY_FREQUENCIES} from './activity-curves-selection';

@Component({
    selector: 'activity-curves-control',
    template: `
    <div class="curve one">
        <label [ngStyle]="{'color': selection.curves[0].color}">Curve 1</label>
        <curve-selection-control [curve]="selection.curves[0]"></curve-selection-control>
    </div>
    <div class="curve two">
        <label [ngStyle]="{'color': selection.curves[1].color}">Curve 2</label>
        <curve-selection-control [curve]="selection.curves[1]"></curve-selection-control>
    </div>
    <div class="curve-common">
        <md-select class="date-interval" placeholder="Date Interval" [(ngModel)]="selection.frequency">
            <md-option *ngFor="let f of frequencies" [value]="f">{{f.label}}</md-option>
        </md-select>

        <md-select class="line-interpolateion" placeholder="Line Interpolation" [(ngModel)]="selection.interpolate">
            <md-option *ngFor="let i of interpolates" [value]="i.value">{{i.label}}</md-option>
        </md-select>
    </div>
    `,
    styles:[`
        .curve >label:after {
            content: ':';
            margin-right: 10px;
        }
        .date-interval {
            width: 125px;
        }
        .line-interpolateion {
            width: 150px;
        }
    `]
})
export class ActivityCurvesControlComponent {
    @Input()
    selection: ActivityCurvesSelection;

    frequencies:ActivityFrequency[] =  ACTIVITY_FREQUENCIES;
    interpolates:any[] = [{
            value: INTERPOLATE.linear,
            label: 'Linear'
        },{
            value: INTERPOLATE.monotone,
            label: 'Monotone',
        },{
            value: INTERPOLATE.stepAfter,
            label: 'Step after'
        }];
}
