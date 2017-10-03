import { NgModule } from '@angular/core';

import {CacheService} from './cache-service';
import {SpeciesTitlePipe} from './species-title.pipe';
import {DoyPipe} from './doy.pipe';

@NgModule({
    declarations: [
        SpeciesTitlePipe
    ],
    providers: [
        CacheService,
        SpeciesTitlePipe,
        DoyPipe
    ]
})
export class NpnCommonModule {}

export {Species} from './species';
export {Phenophase} from './phenophase';

export {CacheService} from './cache-service';
export {Window} from './window';

export {SpeciesTitlePipe} from './species-title.pipe';
export {DoyPipe} from './doy.pipe';
