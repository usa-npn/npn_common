import {Injectable} from '@angular/core';

import {ScatterPlotSelection,ScatterPlotSelectionFactory} from './scatter-plot';
import {CalendarSelection,CalendarSelectionFactory} from './calendar';
import {ActivityCurvesSelection,ActivityCurvesSelectionFactory} from './activity-curves';

// TODO
import {AgddMapSelection,AgddMapSelectionFactory} from './agdd-map';

@Injectable()
export class VisualizationSelectionFactory {

    constructor(private calendar: CalendarSelectionFactory,
                private scatter: ScatterPlotSelectionFactory,
                private activity: ActivityCurvesSelectionFactory,
                private agddMap: AgddMapSelectionFactory) {

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
}
