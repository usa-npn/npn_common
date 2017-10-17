import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {environment} from '../environments/environment';
import {CacheService} from './cache-service';

@Injectable()
export class NetworkService {
    constructor(private http:Http,
                private cache:CacheService) {}

    getStations(networkId):Promise<any[]> {
        return new Promise((resolve,reject) => {
            let url = `${environment.apiRoot}/npn_portal/stations/getStationsForNetwork.json`,
                params = {
                    network_id: networkId
                },
                cacheKey = {
                    u: url,
                    params: params
                },
                data:any[] = this.cache.get(cacheKey) as any[];
            if(data) {
                resolve(data);
            } else {
                this.http.get(url,{params: params})
                    .toPromise()
                    .then(response => {
                        data = response.json() as any[];
                        this.cache.set(cacheKey,data);
                        resolve(data);
                    })
                    .catch(reject);
            }
        });
    }
}
