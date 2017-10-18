/*
it would be ideal to do this and simplify the parent module which would also
allow for each visualization to be imported and used independent of its siblings
but have to ferret out all the dependencies of each sub-module and
include them i.e. all the angular material, etc. so probably an activity for a later date.

import {NgModule} from '@angular/core';

import {ClippedWmsMapSelectionFactory} from './clipped-wms-map-selection-factory';
import {ClippedWmsMapControl} from './clipped-wms-map-control.component';
import {ClippedWmsMapComponent} from './clipped-wms-map.component';

@NgModule({
    imports:[

    ],
    declarations: [
        ClippedWmsMapControl,
        ClippedWmsMapComponent
    ],
    exports: [
        ClippedWmsMapControl,
        ClippedWmsMapComponent
    ],
    providers:[
        ClippedWmsMapSelectionFactory
    ]
})
export class ClippedWmsMapVisModule {}
*/

export {ClippedWmsMapSelection} from './clipped-wms-map-selection';
export {ClippedWmsMapSelectionFactory} from './clipped-wms-map-selection-factory';
export {ClippedWmsMapControl} from './clipped-wms-map-control.component';
export {ClippedWmsMapComponent} from './clipped-wms-map.component';
