import {Injectable} from '@angular/core';

import {VisSelection} from './vis-selection';
import {ScatterPlotSelection,ScatterPlotSelectionFactory} from './scatter-plot';
import {CalendarSelection,CalendarSelectionFactory} from './calendar';
import {ActivityCurvesSelection,ActivityCurvesSelectionFactory} from './activity-curves';

// TODO
import {AgddMapSelection,AgddMapSelectionFactory} from './agdd-map';

@Injectable()
export class VisualizationSelectionFactory {
    private factoryMap:any = {};

    constructor(private calendar: CalendarSelectionFactory,
                private scatter: ScatterPlotSelectionFactory,
                private activity: ActivityCurvesSelectionFactory,
                private agddMap: AgddMapSelectionFactory) {
        this.factoryMap.CalendarSelection = calendar;
        this.factoryMap.ScatterPlotSelection = scatter;
        this.factoryMap.ActivityCurvesSelection = activity;
        this.factoryMap.AgddMapSelection = agddMap;

    }

    newCalendarSelection():CalendarSelection {
        return this.calendar.newSelection();
    }

    newScatterPlotSelection():ScatterPlotSelection {
        return this.scatter.newSelection();
    }

    newActivityCurvesSelection():ActivityCurvesSelection {
        return this.activity.newSelection();
    }

    newAgddMapSelection(): AgddMapSelection {
        return this.agddMap.newSelection();
    }

    cloneSelection(selection:VisSelection): VisSelection {
        return this.newSelection(selection.external);
    }

    newSelections(selections:any[]): VisSelection[] {
        return selections.map(s => this.newSelection(s));
    }

    newSelection(selection:any): VisSelection {
        if(!this.factoryMap[selection.$class]) {
            throw new Error(`Unknown selection type "${selection.$class}"`);
        }
        let s:VisSelection = this.factoryMap[selection.$class].newSelection();
        s.external = selection;
        return s
    }
}
