import {Component,Input} from '@angular/core';

import {MapVisualizationBaseComponent} from '../map-visualization-base.component';

import {AgddMapSelection} from './agdd-map-selection';

import {} from '@types/googlemaps';

@Component({
    selector: 'agdd-map',
    templateUrl: '../map-visualization-base.component.html',
    styleUrls: ['../map-visualization-base.component.scss']
})
export class AgddMapComponent extends MapVisualizationBaseComponent {
    @Input() selection: AgddMapSelection;

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
