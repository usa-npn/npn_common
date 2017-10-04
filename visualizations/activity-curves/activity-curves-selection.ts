import {Headers,Http,URLSearchParams} from '@angular/http';
import {DatePipe} from '@angular/common';
import 'rxjs/add/operator/toPromise';

import {CacheService} from '../../common';
import {environment} from '../../environments/environment';

import {INTERPOLATE,ActivityCurve} from './activity-curve';
import {VisSelection,selectionProperty} from '../vis-selection';

export class ActivityFrequency {
    value:string|number;
    label:string;
}
export const ACTIVITY_FREQUENCY_MONTHLY:ActivityFrequency = {
    value: 'months',
    label: 'Monthly'
};
export const ACTIVITY_FREQUENCY_BIWEEKLY:ActivityFrequency = {
    value: 14,
    label: 'Bi-weekly'
};
export const ACTIVITY_FREQUENCY_WEEKLY:ActivityFrequency = {
    value: 7,
    label: 'Weekly'
};
export const ACTIVITY_FREQUENCIES:ActivityFrequency[] = [
    ACTIVITY_FREQUENCY_MONTHLY,
    ACTIVITY_FREQUENCY_BIWEEKLY,
    ACTIVITY_FREQUENCY_WEEKLY
];

export class ActivityCurvesSelection extends VisSelection {
    private headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    @selectionProperty()
    private _interpolate: INTERPOLATE = INTERPOLATE.monotone;
    @selectionProperty()
    private _dataPoints:boolean = true;
    @selectionProperty()
    private _frequency:ActivityFrequency = ACTIVITY_FREQUENCIES[0];
    @selectionProperty({
        ser: d => d.external,
        des: d => {
            let ac = new ActivityCurve(-1);
            ac.external = d;
            return ac;
        }
    })
    private _curves:ActivityCurve[];

    constructor(protected http: Http,protected cacheService: CacheService,protected datePipe: DatePipe) {
        super();
    }

    get json() {
        return {
            interpolate: this._interpolate,
            dataPoints: this._dataPoints,
            frequency: this._frequency,
            curves: this._curves
        };
    }

    set frequency(f:ActivityFrequency) {
        this._frequency = f;
        // any change in frequency invalidates any data held by curves
        (this._curves||[]).forEach(c => c.data(null));
        // this.update(); ?? existing logic doesn't do this
    }

    get frequency():ActivityFrequency {
        return this._frequency;
    }

    set interpolate(i:INTERPOLATE) {
        this._interpolate = i;
        (this._curves||[]).forEach(c => c.interpolate = i);
        // TODO
        //this.redraw();
    }

    get interpolate():INTERPOLATE {
        return this._interpolate;
    }

    set dataPoints(dp:boolean) {
        this._dataPoints = dp;
        (this._curves||[]).forEach(c => c.dataPoints = dp);
    }

    set curves(cs:ActivityCurve[]) {
        this._curves = cs;
        cs.forEach(c => {
            c.interpolate = this._interpolate;
            c.dataPoints = this._dataPoints;
        });
    }

    get curves():ActivityCurve[] {
        return this._curves;
    }

    private endDate(year) {
        var now = new Date();
        if(year === now.getFullYear()) {
            return this.datePipe.transform(now,'yyyy-MM-dd');
        }
        return year+'-12-31';
    }

    loadCurveData(): Promise<any> {
        return new Promise(resolve => {
            this.working = true;
            let promises:Promise<any[]>[] = this.curves
                .filter(c => c.data(null).isValid())
                .map(c => {
                    return new Promise<any[]>(loaded => {
                        let params = new URLSearchParams();
                        params.set('request_src','npn-vis-activity-curves');
                        params.set('start_date',`${c.year}-01-01`);
                        params.set('end_date',this.endDate(c.year));
                        params.set('frequency',`${this.frequency.value}`);
                        params.set('species_id[0]',`${c.species.species_id}`);
                        params.set('phenophase_id[0]',`${c.phenophase.phenophase_id}`);
                        let url = `${environment.apiRoot}/npn_portal/observations/getMagnitudeData.json`,
                            cacheKey = {
                                u: url,
                                params: params.toString()
                            },
                            data:any[] = this.cacheService.get(cacheKey);
                        if(data) {
                            loaded(c.data(data));
                        } else {
                            this.http.post(url,params.toString(),{headers: this.headers})
                                .toPromise()
                                .then(response => {
                                    let arr = response.json() as any[]
                                    this.cacheService.set(cacheKey,arr);
                                    loaded(c.data(arr));
                                })
                                .catch(this.handleError);
                        }
                    });
                });
            Promise.all(promises).then(() => {
                this.working = false;
                resolve();
            });
        });
    }

    protected handleError(error: any): void {
        console.error('ERROR',error);
    }
}
