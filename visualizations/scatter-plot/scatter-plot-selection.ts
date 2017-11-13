import {environment} from '../../environments/environment';
import {NULL_DATA,ONE_DAY_MILLIS,selectionProperty} from '../vis-selection';
import {SiteOrSummaryVisSelection} from '../site-or-summary-vis-selection';
import {URLSearchParams} from '@angular/http';

import {Species,Phenophase} from '../../common';

import * as d3 from 'd3';

const KEYS_TO_NORMALIZE  = {
    daylength: 'mean_daylength',
    acc_prcp: 'mean_accum_prcp',
    gdd: 'mean_gdd'
};

export const AXIS = [
    {key: 'latitude', label: 'Latitude', axisFmt: d3.format('.2f')},
    {key: 'longitude', label: 'Longitude', axisFmt: d3.format('.2f')},
    {key:'elevation_in_meters',label:'Elevation (m)'},
    {key:'fyy', label: 'Year'},

    {key:'prcp_fall',label:'Precip Fall (mm)'},
    {key:'prcp_spring',label:'Precip Spring (mm)'},
    {key:'prcp_summer',label:'Precip Summer (mm)'},
    {key:'prcp_winter',label:'Precip Winter (mm)'},

    {key:'tmax_fall',label:'Tmax Fall (C\xB0)'},
    {key:'tmax_spring',label:'Tmax Spring (C\xB0)'},
    {key:'tmax_summer',label:'Tmax Summer (C\xB0)'},
    {key:'tmax_winter',label:'Tmax Winter (C\xB0)'},

    {key:'tmin_fall',label:'Tmin Fall (C\xB0)'},
    {key:'tmin_spring',label:'Tmin Spring (C\xB0)'},
    {key:'tmin_summer',label:'Tmin Summer (C\xB0)'},
    {key:'tmin_winter',label:'Tmin Winter (C\xB0)'},

    {key:'daylength',label:'Day Length (s)'},
    {key:'acc_prcp',label:'Accumulated Precip (mm)'},
    {key:'gdd',label:'AGDD'}
];

// NOTE: It's possible that the "plot" class here and the other
// criteria like start/end should be hoisted into the parent class
// which would probably mean the entirety of this class should go there
// but it's not clear if that's the case without another visualization
// making use of the same service/s to drive it...
export interface ScatterPlotSelectionPlot {
    color?: string;
    species?: Species;
    phenophase?: Phenophase;
    [x: string]: any;
}
const TODAY = new Date();

export class ScatterPlotSelection extends SiteOrSummaryVisSelection {
    @selectionProperty()
    start: number = 2010;
    @selectionProperty()
    end: number = (new Date()).getFullYear();
    @selectionProperty()
    regressionLines: boolean = false;
    @selectionProperty()
    axis:any = AXIS[0];
    @selectionProperty({
        ser: d => {
            return {
                color: d.color,
                species: d.species,
                phenophase: d.phenophase
            };
        }
    })
    plots:ScatterPlotSelectionPlot[] = [];

    private d3DateFormat = d3.timeFormat('%x');

    isValid():boolean {
        return this.start &&
               this.end &&
               (this.start < this.end) &&
               this.validPlots.length > 0;
    }

    get validPlots():ScatterPlotSelectionPlot[] {
        return this.plots.filter(p => p.color && p.species && p.phenophase);
    }

    toURLSearchParams(): URLSearchParams {
        let params = new URLSearchParams();
        params.set('climate_data','1');
        params.set('request_src','npn-vis-scatter-plot');
        params.set('start_date',`${this.start}-01-01`);
        params.set('end_date',`${this.end}-12-31`);
        // TODO - this typically comes from app wide configuration settings`
        // is "environment" an ok place to bind this config, probably not
        params.set('num_days_quality_filter',''+environment.appConfig.num_days_quality_filter);
        this.validPlots.forEach((p,i) => {
            params.set(`species_id[${i}]`,`${p.species.species_id}`);
            params.set(`phenophase_id[${i}]`,`${p.phenophase.phenophase_id}`);
        });
        this.addNetworkParams(params);
        return params;
    }

    doyDateFormat(doy:number):string {
        let start = new Date(this.start,0,1),
            time = ((doy-1)*ONE_DAY_MILLIS)+start.getTime(), // TODO, not enforcing that start/end be midnight on Jan 1
            date = new Date(time);
        return this.d3DateFormat(date);
    }

    // data access functions, not sure if the functionality here is too specific
    // to the visualization of the resulting data so should be held somewhere else
    // but it's here for now
    getDoy(d): any {
        return this.individualPhenometrics ? d.first_yes_doy : d.mean_first_yes_doy;
    }

    getFirstYesYear(d): any {
        return this.individualPhenometrics ? d.first_yes_year : d.mean_first_yes_year;
    }

    axisData(d:any):number {
        return d[this.axis.key];
    }

    axisNonNull(data:any[]): any[] {
        return data.filter((d) => {
            return this.axisData(d) !== NULL_DATA;
        });
    }

    postProcessData(data:any[]):any[] {
        let colorKey = (d) => { return `${d.species_id}:${d.phenophase_id}`},
            colorMap = this.validPlots.reduce((map,p) => {
                map[`${p.species.species_id}:${p.phenophase.phenophase_id}`] = p.color;
                return map;
            },{}),
            startYear = this.start,
            result = data.filter((d,i) => {
                if(!(d.color = colorMap[colorKey(d)])) {
                    // this can happen if a phenophase id spans two species but is only plotted for one
                    // e.g. boxelder/breaking leaf buds, boxelder/unfolding leaves, red maple/breaking leaf buds
                    // the service will return data for 'red maple/unfolding leaves' but the user hasn't requested
                    // that be plotted so we need to discard this data.
                    return false;
                }
                d.id = i;
                d.fyy = this.getFirstYesYear(d);
                for(let summaryKey in KEYS_TO_NORMALIZE) {
                    let siteKey = KEYS_TO_NORMALIZE[summaryKey];
                    if(typeof(d[summaryKey]) === 'undefined') {
                        d[summaryKey] = d[siteKey];
                    }
                }
                // this is the day # that will get plotted 1 being the first day of the start_year
                // 366 being the first day of start_year+1, etc.
                d.day_in_range = ((d.fyy-startYear)*365)+this.getDoy(d);
                return true;
            });
            this.working = false;
            return result;
    }
}
