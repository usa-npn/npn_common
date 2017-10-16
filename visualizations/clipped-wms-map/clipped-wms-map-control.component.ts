import {Component, Input, OnInit} from '@angular/core';
import {ClippedWmsMapSelection} from './clipped-wms-map-selection';

@Component({
    selector: 'clipped-wms-map-control',
    template: `
    <md-select class="map-service-input" placeholder="Map" [(ngModel)]="selection.service" (change)="serviceChange()">
        <md-option *ngFor="let s of validServices" [value]="s.value">{{s.label}}</md-option>
    </md-select>
    <md-select class="map-layer-input" placeholder="Layer" [(ngModel)]="selection.layer" (change)="layerChange()">
        <md-option *ngFor="let l of validLayers" [value]="l">{{l.label}}</md-option>
    </md-select>
    `,
    styles:[`
        .map-service-input,
        .map-layer-input {
            width: 200px;
        }
    `]
})
export class ClippedWmsMapControl implements OnInit {
    @Input()
    selection: ClippedWmsMapSelection;

    validServices:any[];
    validLayers:any[];

    serviceChange() {
        this.validLayers = this.selection.validLayers;
        let selection = this.selection,
            layers = this.selection.validLayers;
        selection.layer = layers.length ? layers[0] : undefined;
        this.layerChange();
    }

    layerChange() {
        let selection = this.selection;
        if(selection.isValid()) {
            selection.update();
        } else {
            selection.reset();
        }
    }

    ngOnInit() {
        this.validServices = this.selection.validServices;
        this.serviceChange();
    }
}
