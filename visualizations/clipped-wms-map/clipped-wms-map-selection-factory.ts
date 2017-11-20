import {Injectable,Inject} from '@angular/core';

import {DatePipe} from '@angular/common';
import {NpnConfiguration,NpnServiceUtils,NPN_CONFIGURATION} from '../../common';
import {WmsMapLegendService} from '../../gridded';

import {ClippedWmsMapSelection} from './clipped-wms-map-selection';

@Injectable()
export class ClippedWmsMapSelectionFactory {
    constructor(protected serviceUtils:NpnServiceUtils,
                protected datePipe: DatePipe,
                protected mapLegendService:WmsMapLegendService,
                @Inject(NPN_CONFIGURATION) private config:NpnConfiguration) {}

    newSelection(): ClippedWmsMapSelection {
        return new ClippedWmsMapSelection(this.serviceUtils,this.datePipe,this.mapLegendService,this.config);
    }
}
