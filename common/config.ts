import {InjectionToken} from '@angular/core';

export class NpnConfiguration {
    apiRoot: string; // URL of NPN web services
    dataApiRoot: string; // URL of NPN data web services
    [x: string]: any; // not going to dictate what else it might have
}

export const NPN_CONFIGURATION = new InjectionToken<NpnConfiguration>('NpnConfiguration');