import {Headers,Http,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {CacheService} from '../common';
import {environment} from '../environments/environment';
import {VisSelection,selectionProperty} from './vis-selection';

export abstract class SiteOrSummaryVisSelection extends VisSelection {
    private headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    @selectionProperty()
    individualPhenometrics: boolean = false;
    @selectionProperty()
    filterDisclaimer: string;

    constructor(protected http: Http,protected cacheService: CacheService) {
        super();
    }

    abstract toURLSearchParams(): URLSearchParams;

    private filterSuspectSummaryData (d){
        var bad = (d.latitude === 0.0 || d.longitude === 0.0 || d.elevation_in_meters < 0);
        if(bad) {
            console.warn('suspect station data',d);
        }
        return !bad;
    }

    private filterLqSummaryData (d) {
        var keep = d.numdays_since_prior_no >= 0;
        if(!keep) {
            console.debug('filtering less precise data from summary output',d);
        }
        return keep;
    }

    private filterLqSiteData(d) {
        var keep = d.mean_numdays_since_prior_no >= 0;
        if(!keep) {
            console.debug('filtering less precise data from site level output',d);
        }
        return keep;
    }

    getData(): Promise<Array<any>> {
        let params = this.toURLSearchParams(), // TODO "addCommonParams"
            url = `${environment.apiRoot}/npn_portal/observations/${this.individualPhenometrics ? 'getSummarizedData': 'getSiteLevelData'}.json`,
            cacheKey = {
                u: url,
                params: params.toString()
            },
            data:any[] = this.cacheService.get(cacheKey),
            filterLqd = this.individualPhenometrics ?
                (data) => { // summary
                    let minusSuspect = data.filter(this.filterSuspectSummaryData),
                        filtered = environment.appConfig.filterLqdSummary ?  minusSuspect.filter(this.filterLqSummaryData) : minusSuspect,
                        individuals = filtered.reduce(function(map,d){
                            var key = d.individual_id+'/'+d.phenophase_id+'/'+d.first_yes_year;
                            map[key] = map[key]||[];
                            map[key].push(d);
                            return map;
                        },{}),
                        uniqueIndividuals = [];
                    console.debug('filtered out '+(data.length-minusSuspect.length)+'/'+data.length+' suspect records');
                    console.debug('filtered out '+(minusSuspect.length-filtered.length)+'/'+minusSuspect.length+' LQD records.');
                    for(let key in individuals) {
                        let arr = individuals[key];
                        if(arr.length > 1) {
                            // sort by first_yes_doy
                            arr.sort(function(a,b){
                                return a.first_yes_doy - b.first_yes_doy;
                            });
                        }
                        // use the earliest record
                        uniqueIndividuals.push(arr[0]);
                    }
                    console.debug('filtered out '+(filtered.length-uniqueIndividuals.length)+'/'+filtered.length+ ' individual records (preferring lowest first_yes_doy)');
                    this.filterDisclaimer = (minusSuspect.length !== filtered.length) ?
                        environment.appConfig.filterLqdDisclaimer : undefined;
                    return filtered;
                } :
                (data) => { // site
                    let minusSuspect = data.filter(this.filterSuspectSummaryData),
                        filtered = environment.appConfig.filterLqdSummary ? minusSuspect.filter(this.filterLqSiteData) : minusSuspect;
                    console.debug('filtered out '+(data.length-minusSuspect.length)+'/'+data.length+' suspect records');
                    console.debug('filtered out '+(minusSuspect.length-filtered.length)+'/'+minusSuspect.length+' LQD records.');
                    this.filterDisclaimer = (minusSuspect.length !== filtered.length) ?
                        environment.appConfig.filterLqdDisclaimer : undefined;
                    return filtered;
                }

        if(data) {
            console.log('found in cache',data);
            return Promise.resolve(filterLqd(data));
        }
        return this.http.post(url,params.toString(),{headers: this.headers})
            .toPromise()
            .then(response => {
                let arr = response.json() as any[]
                this.cacheService.set(cacheKey,arr);
                return filterLqd(arr);
            })
            .catch(this.handleError);
    }

    protected handleError(error: any): void {
        console.error('ERROR',error);
    }
}
