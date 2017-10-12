import {Component,Input} from '@angular/core';

import {MapVisualizationBaseComponent} from '../map-visualization-base.component';

import {ClippedWmsMapSelection} from './clipped-wms-map-selection';

import {} from '@types/googlemaps';

@Component({
    selector: 'clipped-wms-map',
    templateUrl: '../map-visualization-base.component.html',
    styleUrls: ['../map-visualization-base.component.scss']
})
export class ClippedWmsMapComponent extends MapVisualizationBaseComponent {
    @Input() selection: ClippedWmsMapSelection;

    mapReady(map:google.maps.Map): void {
        // TODO should be private.
        this.getMapResolver(map);
    }

    protected resize(): void {
        super.resize();
        console.log('MAP SELECTION',this.selection);
        this.getMap().then(m => this.selection.addTo(m));
    }
}
