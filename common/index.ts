import { NgModule } from '@angular/core';

import {CacheService} from './cache-service';
import {SpeciesTitlePipe} from './species-title.pipe';
import {DoyPipe} from './doy.pipe';
import {LegendDoyPipe} from './legend-doy.pipe';

import {DatePipe} from '@angular/common';

@NgModule({
    declarations: [
        SpeciesTitlePipe
    ],
    providers: [
        CacheService,
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
export {Window} from './window';

export {SpeciesTitlePipe} from './species-title.pipe';
export {DoyPipe} from './doy.pipe';
export {LegendDoyPipe} from './legend-doy.pipe';
