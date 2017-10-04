import {Headers,Http,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {VisSelection,selectionProperty} from './vis-selection';
import {CacheService,Species,Phenophase,SpeciesTitlePipe} from '../common';
import {environment} from '../environments/environment';

export class ObservationDatePlot {
    color: String;
    species: Species;
    phenophase: Phenophase;
    [x: string]: any;
}

export class ObservationDataDataPoint {
    x: number;
    y: number;
    color: string;
}
export class ObservationDateData {
    labels: string[] = [];
    data: ObservationDataDataPoint[] = [];
}

export abstract class ObservationDateVisSelection extends VisSelection {
    private headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    requestSrc:string = 'observation-date-vis-selection';

    @selectionProperty()
    negative:boolean = false;
    @selectionProperty()
    negativeColor:string = '#aaa'
    @selectionProperty({des: d => new Date(d)})
    years:Date[];
    @selectionProperty()
    plots:ObservationDatePlot[];

    constructor(protected http: Http,protected cacheService: CacheService, protected speciesTitle: SpeciesTitlePipe) {
        super();
    }

    toURLSearchParams(): URLSearchParams {
        let params = new URLSearchParams();
        params.set('request_src',this.requestSrc);
        this.years.forEach((y,i) => {
            params.set(`year[${i}]`,`${y.getFullYear()}`);
        });
        this.plots.forEach((plot,i) => {
            params.set(`species_id[${i}]`,`${plot.species.species_id}`);
            params.set(`phenophase_id[${i}]`,`${plot.phenophase.phenophase_id}`);
        });
        return params;
    }

    getData(): Promise<ObservationDateData> {
        let params = this.toURLSearchParams(),
        url = `${environment.apiRoot}/npn_portal/observations/getObservationDates.json`,
        cacheKey = {
            u: url,
            params: params.toString()
        },
        data:any[] = this.cacheService.get(cacheKey),
        process = (data:any[]):ObservationDateData => {
            let response = new ObservationDateData(),
                y = (this.plots.length*this.years.length)-1,
                addDoys = (doys,color) => {
                    doys.forEach(doy => {
                        response.data.push({
                            y: y,
                            x: doy,
                            color: color
                        });
                    });
                },
                speciesMap = data.reduce((map,species) => {
                    map[species.species_id] = species;
                    species.phenophases = species.phenophases.reduce(function(m,pp){
                        m[pp.phenophase_id] = pp;
                        return m;
                    },{});
                    return map;
                },{});
                console.log('speciesMap',speciesMap);
            this.plots.forEach(plot => {
                let species = speciesMap[plot.species.species_id],
                    phenophase = species.phenophases[plot.phenophase.phenophase_id];
                this.years.forEach(yr => {
                    let year = yr.getFullYear();
                    if(phenophase && phenophase.years && phenophase.years[year]) {
                        if(this.negative) {
                            console.debug('year negative',y,year,species.common_name,phenophase,phenophase.years[year].negative);
                            addDoys(phenophase.years[year].negative,this.negativeColor);
                        }
                        console.debug('year positive',y,year,species.common_name,phenophase,phenophase.years[year].positive);
                        addDoys(phenophase.years[year].positive,plot.color);
                    }
                    response.labels.splice(0,0,this.speciesTitle.transform(plot.species)+'/'+plot.phenophase.phenophase_name+' ('+year+')');
                    console.debug('y of '+y+' is for '+response.labels[0]);
                    y--;
                });
            });
            console.log('observation data',response);
            return response;
        };

        if(data) {
            return Promise.resolve(process(data));
        } else {
            this.working = true;
            return new Promise(resolve => {
                this.http.post(url,params.toString(),{headers: this.headers})
                    .toPromise()
                    .then(response => {
                        let arr = response.json() as any[];
                        this.cacheService.set(cacheKey,arr);
                        this.working = false;
                        resolve(process(arr));
                    })
                    .catch(this.handleError);
            });
        }
    }

    protected handleError(error: any): void {
        console.error('ERROR',error);
    }
}
