import {NgModule,InjectionToken} from '@angular/core';

import {CacheService} from './cache-service';
import {SpeciesService} from './species.service';
import {NetworkService} from './network.service';

import {SpeciesTitlePipe} from './species-title.pipe';
import {DoyPipe} from './doy.pipe';
import {LegendDoyPipe} from './legend-doy.pipe';

import {DatePipe} from '@angular/common';

import {NpnConfiguration,NPN_CONFIGURATION} from './config';

export const NPN_BASE_HREF = new InjectionToken<string>('npnBaseHref');

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
        LegendDoyPipe,
        {provide: NPN_BASE_HREF, useValue: '/'},
        {provide: NPN_CONFIGURATION, useValue: {
            apiRoot: 'http://www-dev.usanpn.org',
            dataApiRoot: 'http://data-dev.usanpn.org:3006',
        }}
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
export * from './config';
