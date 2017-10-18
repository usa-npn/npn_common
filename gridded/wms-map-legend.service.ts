import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as $ from 'jquery';

import {WmsPipeFactory} from './wms-pipe-factory.service';
import {WmsMapLayerService} from './wms-map-layer.service';
import {CacheService} from '../common';
import {WmsMapLegend} from './wms-map-legend';
import {WMS_VERSION,WMS_BASE_URL} from './gridded-common';

@Injectable()
export class WmsMapLegendService {
    legends:any = {};

    constructor(private wmsPipeFactory:WmsPipeFactory, private http:Http,private cache:CacheService,private layerService:WmsMapLayerService) {
    }

    getLegend(layerName:string):Promise<WmsMapLegend> {
        return new Promise((resolve,reject) => {
            if(this.legends[layerName]) {
                return resolve(this.legends[layerName]);
            }
            this.layerService.getLayerDefinition(layerName)
                .then(layerDefinition => {
                    if(!layerDefinition) {
                        return reject(`layer definition for ${layerName} not found.`)
                    }
                    this.http.get(WMS_BASE_URL,{
                        params: {
                            service: 'wms',
                            request: 'GetStyles',
                            version: WMS_VERSION,
                            layers: layerName
                        }
                    })
                    .toPromise()
                    .then(response => {
                        let xml = response.text(),
                            legend_data = $($.parseXML(xml)),
                            color_map = legend_data.find('ColorMap');
                        if(color_map.length === 0) {
                            // FF
                            color_map = legend_data.find('sld\\:ColorMap');
                        }
                        let l:WmsMapLegend = color_map.length !== 0 ?
                            new WmsMapLegend(this.wmsPipeFactory,
                                    $(color_map.toArray()[0]),
                                    layerDefinition,
                                    legend_data) : undefined;
                        this.legends[layerName] = l;
                        resolve(l);
                    })
                    .catch(reject);
                });

        });
    }
}
