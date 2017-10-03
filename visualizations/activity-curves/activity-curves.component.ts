import {Component, Input, ElementRef} from '@angular/core';

import {Window} from '../../common';
import {VisualizationMargins} from '../visualization-base.component';
import {SvgVisualizationBaseComponent,DEFAULT_MARGINS,FONT_SIZE,FONT_SIZE_PX} from '../svg-visualization-base.component';

import {ActivityCurvesSelection} from './activity-curves-selection';

@Component({
    selector: 'activity-curves',
    templateUrl: '../svg-visualization-base.component.html',
    styleUrls: ['../svg-visualization-base.component.scss']
})
export class ActivityCurvesComponent extends SvgVisualizationBaseComponent {
    @Input() selection: ActivityCurvesSelection;

    margins: VisualizationMargins = {top: 80,left: 80,right: 80,bottom: 80};

    constructor(protected window: Window, protected rootElement: ElementRef) {
        super(window,rootElement);
    }

    protected reset(): void {
        super.reset();
        let chart = this.chart,
            sizing = this.sizing;
        // TODO
        this.commonUpdates();
    }

    protected update(): void {
        this.reset();
        let selection = this.selection;
        // TODO go get data and draw it
    }

    protected redraw(): void {
        // TODO
    }
}
