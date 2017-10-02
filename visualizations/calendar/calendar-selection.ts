import {ObservationDateVisSelection} from '../observation-date-vis-selection';

import {FONT_SIZE} from '../visualization-base.component';

export class CalendarSelection extends ObservationDateVisSelection {
    labelOffset:number = 4;
    bandPadding:number = 0.5;
    fontSizeDelta:number = 0;
    monthFormat?:string;
}

export {ObservationDataDataPoint,ObservationDateData} from '../observation-date-vis-selection';
