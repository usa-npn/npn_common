import {Component, Input, OnInit} from '@angular/core';

import {VisSelectionEvent} from '../vis-selection';
import {ScatterPlotSelection,AXIS} from './scatter-plot-selection';

import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'scatter-plot-control',
    template: `
    <year-range-input [(start)]="yearStart" [(end)]="yearEnd" (onStartChange)="yearChange($event)" (onEndChange)="yearChange($event)"></year-range-input>

    <div class="phenophase-input-wrapper" *ngFor="let spi of selection.plots; index as idx">
        <species-phenophase-input
            [(species)]="spi.species" [(phenophase)]="spi.phenophase" [(color)]="spi.color"
            [gatherColor]="true"
            (onSpeciesChange)="updateChange()"
            (onPhenophaseChange)="updateChange()"
            (onColorChange)="redrawChange($event)"></species-phenophase-input>
        <button *ngIf="idx > 0" md-button class="remove-plot" (click)="removePlot(idx)">Remove</button>
        <button *ngIf="selection.plots.length < 3 && idx === (selection.plots.length-1)" md-button class="add-plot" [disabled]="!plotsValid()" (click)="addPlot()">Add</button>
    </div>

    <div>
        <md-select placeholder="X Axis" name="xAxis" [(ngModel)]="selection.axis" (change)="redrawChange()">
          <md-option *ngFor="let a of axis" [value]="a">{{a.label}}</md-option>
        </md-select>
        <md-checkbox [(ngModel)]="selection.regressionLines" (change)="redrawChange()">Fit Lines</md-checkbox>
        <md-checkbox [(ngModel)]="selection.individualPhenometrics" (change)="updateChange()">Use Individual Phenometrics</md-checkbox>
    </div>
    `,
    styles: [`
        year-range-input,
        .phenophase-input-wrapper {
            display: block;
            margin-top: 15px;
        }
    `]
})
export class ScatterPlotControls {
    @Input()
    selection: ScatterPlotSelection;
    axis = AXIS;

    yearStart:number;
    yearEnd:number;

    updateSent:boolean = false;

    ngOnInit() {
        this.addPlot();
    }

    yearChange(change) {
        if(change && change.oldValue !== change.newValue && this.yearStart && this.yearEnd) {
            this.selection.start = new Date(this.yearStart,0,1);
            this.selection.end = new Date(this.yearEnd,11,31);
            this.updateChange();
        }
    }

    updateChange() {
        if(this.selection.isValid()) {
            this.selection.update();
            this.updateSent = true;
        }
    }

    redrawChange(change) {
        if(this.selection.isValid()) {
            if(change && !change.oldValue && change.newValue) { // e.g. no color to a color means a plot that wasn't valid is now potentially valid.
                this.updateChange();
            } else {
                if(this.updateSent) {
                    this.selection.redraw();
                } else {
                    this.updateChange();
                }
            }
        }
    }

    addPlot() {
        this.selection.plots.push({});
    }

    removePlot(index:number) {
        this.selection.plots.splice(index,1);
        this.updateChange();
    }

    plotsValid() {
        return this.selection.plots.length === this.selection.validPlots.length;
    }
}
