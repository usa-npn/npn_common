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

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
export function detectIE() {
  var ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // IE 12 / Spartan
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge (IE 12+)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}
