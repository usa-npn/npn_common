
import {INTERPOLATE,ActivityCurve} from './activity-curve';
import {VisSelection} from '../vis-selection';

export class ActivityFrequency {
    value:string|number;
    label:string;
}
export const FREQUENCIES:ActivityFrequency[] = [{
        value: 'months',
        label: 'Monthly'
    },{
        value: 14,
        label: 'Bi-weekly'
    },{
        value: 7,
        label: 'Weekly'
    }];

export class ActivityCurvesSelection extends VisSelection {
    private _interpolate: INTERPOLATE = INTERPOLATE.monotone;
    private _dataPoints:boolean = true;
    private _frequency:ActivityFrequency = FREQUENCIES[0];
    private _curves:ActivityCurve[];

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

}
