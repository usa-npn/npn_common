import {Injectable,Inject} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {CacheService} from './cache-service';

import {NpnConfiguration,NPN_CONFIGURATION} from './config';

@Injectable()
export class NpnServiceUtils {
    constructor(public http:Http,
                public cache:CacheService,
                @Inject(NPN_CONFIGURATION) public config:NpnConfiguration) {
                }

    public apiUrl(suffix:string) {
        return `${this.config.apiRoot}${suffix}`;
    }

    public dataApiUrl(suffix:string) {
        return `${this.config.dataApiRoot}${suffix}`;
    }

    public cachedGet(url: string, params?:any, asText?:boolean): Promise<any> {
        params = params||{};
        return new Promise((resolve,reject) => {
            let cacheKey = {
                u: url,
                params: params
            },
            data:any = this.cache.get(cacheKey);
            if(data) {
                resolve(data);
            } else {
                this.http.get(url,{params:params})
                    .toPromise()
                    .then(response => {
                        data = asText ?
                            response.text() as any: response.json() as any;
                        this.cache.set(cacheKey,data);
                        resolve(data);
                    })
                    .catch(reject);
            }
        });
    }
}
