import {Component,Input,OnInit} from '@angular/core';

import {VisSelection} from './vis-selection';

import {ScatterPlotSelection} from './scatter-plot';
import {CalendarSelection} from './calendar';
import {ActivityCurvesSelection} from './activity-curves';
import {AgddMapSelection} from './agdd-map';

// the idea here is that with Angular 2/4 there is no $compile functionality
// so instead it's probably best to create an "all knowing" directive that
// includes all possible visualizations and picks which to render based on
// the type of selection it is given.
@Component({
    selector: 'npn-visualization',
    template: `
    <scatter-plot *ngIf="scatter" [selection]="scatter" [showDownload]="showDownload"></scatter-plot>
    <calendar *ngIf="calendar" [selection]="calendar"  [showDownload]="showDownload"></calendar>
    <activity-curves *ngIf="activity" [selection]="activity"  [showDownload]="showDownload"></activity-curves>
    <agdd-map *ngIf="agdd" [selection]="agdd"></agdd-map>
    <md-expansion-panel *ngIf="selection.debug">
        <md-expansion-panel-header>
            <md-panel-title>Selection</md-panel-title>
        </md-expansion-panel-header>
        <pre>{{selection.external | json}}</pre>
    </md-expansion-panel>
    `,
    styles: [`
        pre {
            font-family: "courier new";
        }
        md-expansion-panel {
            margin-top: 10px;
        }
    `]
})
export class VisualizationComponent implements OnInit {
    @Input()
    showDownload:boolean = true;

    @Input()
    selection: VisSelection;

    private scatter: ScatterPlotSelection;
    private calendar: CalendarSelection;
    private activity: ActivityCurvesSelection;
    private agdd: AgddMapSelection;

    ngOnInit() {
        if(this.selection instanceof ScatterPlotSelection) {
            this.scatter = this.selection;
        }
        if(this.selection instanceof CalendarSelection) {
            this.calendar = this.selection;
        }
        if(this.selection instanceof AgddMapSelection) {
            this.agdd = this.selection;
        }
        if(this.selection instanceof ActivityCurvesSelection) {
            this.activity = this.selection;
        }
    }
}
