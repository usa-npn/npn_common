import {Component, Input} from '@angular/core';

import {ScatterPlotSelection,AXIS} from './scatter-plot-selection';

@Component({
    selector: 'scatter-plot-controls',
    template: `
    <md-select placeholder="X Axis" name="xAxis" [(ngModel)]="selection.axis" (change)="selection.redraw()">
      <md-option *ngFor="let a of axis" [value]="a">{{a.label}}</md-option>
    </md-select>
    <md-checkbox [(ngModel)]="selection.regressionLines" (change)="selection.redraw()">Fit Lines</md-checkbox>
    <md-checkbox [(ngModel)]="selection.individualPhenometrics" (change)="selection.update()">Use Individual Phenometrics</md-checkbox>
    `
})
export class ScatterPlotControls {
    @Input() selection: ScatterPlotSelection;
    axis = AXIS;
}
