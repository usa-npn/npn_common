import {NgModule,InjectionToken} from '@angular/core';

import {CacheService} from './cache-service';
import {SpeciesService} from './species.service';
import {NetworkService} from './network.service';

import {SpeciesTitlePipe} from './species-title.pipe';
import {DoyPipe} from './doy.pipe';
import {LegendDoyPipe} from './legend-doy.pipe';

import {DatePipe} from '@angular/common';

import {NpnConfiguration,NPN_CONFIGURATION} from './config';
import {NpnServiceUtils} from './npn-service-utils.service';

export const NPN_BASE_HREF = new InjectionToken<string>('npnBaseHref');

@NgModule({
    declarations: [
        SpeciesTitlePipe,
        LegendDoyPipe,
        DoyPipe
    ],
    exports: [
        SpeciesTitlePipe,
        LegendDoyPipe,
        DoyPipe
    ],
    providers: [
        CacheService,
        SpeciesService,
        NetworkService,
        NpnServiceUtils,
        SpeciesTitlePipe,
        DatePipe,
        DoyPipe,
        LegendDoyPipe,
        {provide: NPN_BASE_HREF, useValue: '/'},
        {provide: NPN_CONFIGURATION, useValue: {
            apiRoot: '//www-dev.usanpn.org',
            dataApiRoot: '//data-dev.usanpn.org:3006',
            geoServerRoot: '//geoserver-dev.usanpn.org/geoserver'
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
export {NpnServiceUtils} from './npn-service-utils.service';
