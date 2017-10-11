import {Component,Input,OnInit} from '@angular/core';

import {CalendarSelection} from './calendar-selection';

const THIS_YEAR = (new Date()).getFullYear();

@Component({
    selector: 'calendar-control',
    template: `
    <div>
        <div class="year-input-wrapper" *ngFor="let plotYear of selection.years;index as idx">
            <md-select class="year-input" placeholder="Year" [(ngModel)]="selection.years[idx]" (change)="updateChange()">
                <md-option *ngFor="let y of validStarts" [value]="y">{{y}}</md-option>
            </md-select>
            <button *ngIf="idx > 0" md-button class="remove-year" (click)="removeYear(idx)">Remove</button>
            <button *ngIf="selection.years.length < 6 && idx === (selection.years.length-1)" md-button class="add-year" (click)="addYear()">Add</button>
        </div>
    </div>

    <div class="phenophase-input-wrapper" *ngFor="let spi of selection.plots; index as idx">
        <species-phenophase-input
            [(species)]="spi.species" [(phenophase)]="spi.phenophase" [(color)]="spi.color"
            [selection]="selection"
            [gatherColor]="true"
            (onSpeciesChange)="updateChange()"
            (onPhenophaseChange)="updateChange()"
            (onColorChange)="redrawChange($event)"></species-phenophase-input>
        <button *ngIf="idx > 0" md-button class="remove-plot" (click)="removePlot(idx)">Remove</button>
        <button *ngIf="idx === (selection.plots.length-1)" md-button class="add-plot" [disabled]="!plotsValid()" (click)="addPlot()">Add</button>
    </div>

    <md-checkbox [(ngModel)]="selection.negative" (change)="redrawChange()">Display negative data</md-checkbox>

    <label for="label-size-input">Label size
        <md-slider id="label-size-input" min="0" max="10" step="0.25" [(ngModel)]="selection.fontSizeDelta" (change)="redrawChange()" [disabled]="!selection.isValid()"></md-slider>
    </label>

    <label for="label-position-input">Label position
        <md-slider id="label-position-input" min="0" max="100" step="1" [(ngModel)]="selection.labelOffset" (change)="redrawChange()" [disabled]="!selection.isValid()"></md-slider>
    </label>

    <label for="label-band-size-input">Band size
        <md-slider invert id="label-band-size-input" min="0" max="0.95" step="0.05" [(ngModel)]="selection.bandPadding" (change)="redrawChange()" [disabled]="!selection.isValid()"></md-slider>
    </label>
    `,
    styles:[`
        .year-input-wrapper {
            display: inline-block;
            margin-right: 15px;
        }
        .phenophase-input-wrapper {
            display: block;
            margin-top: 15px;
        }
        label[for="label-size-input"] {
            margin-left: 15px;
        }
    `]
})
export class CalendarControlComponent implements OnInit {
    @Input()
    selection: CalendarSelection;

    maxYears = 5;
    updateSent:boolean = false;

    validStarts:number[] = (function(){
        let max = THIS_YEAR+1,
            current = 1900,
            years:number[] = [];
        while(current < max) {
            years.push(current++);
        }
        return years;
    })();

    ngOnInit() {
        if(this.selection.years.length === 0) {
            this.addYear();
        }
        if(this.selection.plots.length === 0) {
            this.addPlot();
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

    addYear() {
        this.selection.years.push(THIS_YEAR);
        this.updateChange();
    }

    removeYear(index:number) {
        this.selection.years.splice(index,1);
        this.updateChange();
    }

    plotsValid() {
        return this.selection.plots.length === this.selection.validPlots.length;
    }
}
