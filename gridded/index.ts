import {NgModule} from '@angular/core';
import {DatePipe,DecimalPipe} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material';

import {WmsPipeFactory} from './wms-pipe-factory.service';
import {WmsMapLayerService} from './wms-map-layer.service';
import {WmsMapLegendService} from './wms-map-legend.service';
import {NpnCommonModule} from '../common';
import {DateExtentUtil} from './date-extent-util.service';
import {WmsMapLegendComponent} from './wms-map-legend.component';
import {WmsMapOpacityControl} from './wms-map-opacity-control.component';

import {LegendGddUnitsPipe,AgddDefaultTodayElevationPipe,LegendAgddAnomalyPipe,
        AgddDefaultTodayTimePipe,LegendSixAnomalyPipe,LegendDoyPipe,ExtentDatesPipe} from './pipes';

@NgModule({
    imports:[
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,ReactiveFormsModule
        MatSliderModule,
        NpnCommonModule
    ],
    declarations:[
        WmsMapLegendComponent,
        WmsMapOpacityControl
    ],
    exports:[
        WmsMapLegendComponent,
        WmsMapOpacityControl
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
export {WmsMapSupportsOpacity} from './wms-map-opacity-control.component';
