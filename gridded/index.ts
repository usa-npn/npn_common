import {NgModule} from '@angular/core';
import {DatePipe,DecimalPipe} from '@angular/common';

import {WmsPipeFactory} from './wms-pipe-factory.service';
import {WmsMapLayerService} from './wms-map-layer.service';
import {WmsMapLegendService} from './wms-map-legend.service';
import {NpnCommonModule} from '../common';
import {DateExtentUtil} from './date-extent-util.service';

import {LegendGddUnitsPipe,AgddDefaultTodayElevationPipe,LegendAgddAnomalyPipe,
        AgddDefaultTodayTimePipe,LegendSixAnomalyPipe,LegendDoyPipe,ExtentDatesPipe} from './pipes';

@NgModule({
    imports:[
        NpnCommonModule
    ],
    declarations:[

    ],
    exports:[

    ],
    providers:[
        DatePipe,DecimalPipe,
        DateExtentUtil,
        LegendGddUnitsPipe,AgddDefaultTodayElevationPipe,LegendAgddAnomalyPipe,
        AgddDefaultTodayTimePipe,LegendSixAnomalyPipe,LegendDoyPipe,ExtentDatesPipe,
        WmsPipeFactory,
        WmsMapLayerService,
        WmsMapLegendService
    ]
})
export class NpnGriddedModule {}

//export * from './wms-map-layer';
export * from './wms-map-layer.service';
export * from './wms-map-legend';
export * from './wms-map-legend.service';
