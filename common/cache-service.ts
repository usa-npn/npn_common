import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {Md5} from 'ts-md5/dist/md5';

@Injectable()
export class CacheService {
    ttl: number = environment.cacheTTL;

    private cacheKey(key:any): string {
        if(typeof(key) !== 'string') {
            key = JSON.stringify(key);
        }
        // not sure about the .toString() on the end since Md=5.hashStr returns string Int32Array
        return Md5.hashStr(key).toString();
    }

    get(key:any): any {
        if(environment.cacheTTL <= 0) {
            return null; // caching disabled
        }
        let ck = this.cacheKey(key),
            entry:any = sessionStorage.getItem(ck);
        if(entry) {
            entry = JSON.parse(entry) as CacheEntry;
            if(Date.now() < entry.expiry) {
                console.log('cache hit',ck,entry.data);
                return entry.data;
            }
            console.log('cache expired',ck);
            window.sessionStorage.removeItem(ck);
        } else {
            console.log('cache miss',ck);
        }
        return null;
    }

    set(key:any,data:any):void {
        if(environment.cacheTTL <= 0) {
            return null; // caching disabled
        }
        let ck = this.cacheKey(key);
        if(data) {
            let entry:CacheEntry = {
                    expiry: (Date.now()+environment.cacheTTL),
                    data: data
                };
            console.log('caching',ck,data);
            sessionStorage.setItem(ck,JSON.stringify(entry));
        } else {
            console.log('removing from cache',ck);
            sessionStorage.removeItem(ck);
        }
    }
}

class CacheEntry {
    expiry: number;
    data: any;
}
