import { NgModule } from '@angular/core';

import {CacheService} from './cache-service';
import {SpeciesService} from './species.service';
import {NetworkService} from './network.service';

import {SpeciesTitlePipe} from './species-title.pipe';
import {DoyPipe} from './doy.pipe';
import {LegendDoyPipe} from './legend-doy.pipe';

import {DatePipe} from '@angular/common';

@NgModule({
    declarations: [
        SpeciesTitlePipe,
        LegendDoyPipe
    ],
    exports: [
        SpeciesTitlePipe,
        LegendDoyPipe
    ],
    providers: [
        CacheService,
        SpeciesService,
        NetworkService,
        SpeciesTitlePipe,
        DatePipe,
        DoyPipe,
        LegendDoyPipe
    ]
})
export class NpnCommonModule {}

export {Species} from './species';
export {Phenophase} from './phenophase';

export {CacheService} from './cache-service';
export {SpeciesService} from './species.service';
export {NetworkService} from './network.service';
export {Window} from './window';

export {SpeciesTitlePipe} from './species-title.pipe';
export {DoyPipe} from './doy.pipe';
export {LegendDoyPipe} from './legend-doy.pipe';
export {Guid} from './guid';
