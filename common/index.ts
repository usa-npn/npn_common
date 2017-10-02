import { NgModule } from '@angular/core';

import {CacheService} from './cache-service';
import {SpeciesTitlePipe} from './species-title.pipe';

@NgModule({
    declarations: [
        SpeciesTitlePipe
    ],
    providers: [
        CacheService,
        SpeciesTitlePipe
    ]
})
export class NpnCommonModule {}

export {Species} from './species';
export {Phenophase} from './phenophase';
export {SpeciesTitlePipe} from './species-title.pipe';
export {CacheService} from './cache-service';
export {Window} from './window';
