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
import {GriddedUrls} from './gridded-common';
import {WcsDataService} from './wcs-data.service';

import {LegendGddUnitsPipe,AgddDefaultTodayElevationPipe,LegendAgddAnomalyPipe,
        AgddDefaultTodayTimePipe,LegendSixAnomalyPipe,LegendDoyPipe,ExtentDatesPipe} from './pipes';

@NgModule({
    imports:[
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,ReactiveFormsModule,
        MatSliderModule,
        NpnCommonModule
    ],
    declarations:[
        WmsMapLegendComponent,
        WmsMapOpacityControl,
        LegendGddUnitsPipe,AgddDefaultTodayElevationPipe,LegendAgddAnomalyPipe,
        AgddDefaultTodayTimePipe,LegendSixAnomalyPipe,LegendDoyPipe,ExtentDatesPipe
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
        WmsMapLegendService,
        GriddedUrls,
        WcsDataService
    ]
})
export class NpnGriddedModule {}

//export * from './wms-map-layer';
export * from './wms-map-layer.service';
export * from './wms-map-legend';
export * from './wms-map-legend.service';
export * from './wcs-data.service';
export {WmsMapSupportsOpacity} from './wms-map-opacity-control.component';

// this may not be the best or final home for this functionality...
export function googleFeatureBounds(feature) {
    var geo = feature.getGeometry(),
        type = geo.getType();
    /*if(!type || /LineString/.test(type)) {
        // TODO ? generate bounds of a [Multi]LineString?
    } else {*/
    if(type && /Polygon/.test(type)) {
        var bounds = new google.maps.LatLngBounds(),
            arr = geo.getArray(),
            rings = type === 'Polygon' ?
                arr :
                arr.reduce(function(c,p){
                    c.push(p.getArray()[0]);
                    return c;
                },[]),i,j;
        for(i = 0; i < rings.length; i++) {
            var ringArr = rings[i].getArray();
            for(j = 0; j < ringArr.length; j++) {
                bounds.extend(new google.maps.LatLng(ringArr[j].lat(),ringArr[j].lng()));
            }
        }
        return bounds;
    }
}
