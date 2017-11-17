import {NetworkAwareVisSelection,selectionProperty,ONE_DAY_MILLIS} from '../vis-selection';
import{CacheService,NpnConfiguration} from '../../common';
import {WmsMapLegend,WmsMapLegendService,WmsMapSupportsOpacity} from '../../gridded';

import {DatePipe} from '@angular/common';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {} from '@types/googlemaps';

const SIX_LAYERS:ClippedLayerDef[] = [{
    label: 'Current Si-x leaf index',
    layerName: 'si-x:average_leaf_ncep',
    clippingService: 'si-x/area/clippedImage',
    statisticsService: 'si-x/area/statistics'
},{
    label: '6-day forecast',
    layerName: 'si-x:average_leaf_ncep',
    clippingService: 'si-x/area/clippedImage',
    statisticsService: 'si-x/area/statistics',
    forecast: true
},{
    label: 'Anomaly',
    layerName: 'si-x:leaf_anomaly',
    clippingService: 'si-x/anomaly/area/clippedImage',
    statisticsService: 'si-x/anomaly/area/statistics'
}];
const AGDD_LAYERS:ClippedLayerDef[] = [{
    label: 'Current AGDD',
    layerName: 'gdd:agdd',
    clippingService: 'agdd/area/clippedImage',
    statisticsService: 'agdd/area/statistics',
    statsParams: {
        useCache: false
    }
},{
    label: '6-day forecast',
    layerName: 'gdd:agdd',
    clippingService: 'agdd/area/clippedImage',
    statisticsService: 'agdd/area/statistics',
    forecast: true,
    statsParams: {
        useCache: false
    }
},{
    label: 'Anomaly',
    layerName: 'gdd:agdd_anomaly',
    clippingService: 'agdd/anomaly/area/clippedImage',
    statisticsService: 'agdd/anomaly/area/statistics',
    statsParams: {
        useCache: false
    }
}];

export class ClippedWmsMapSelection extends NetworkAwareVisSelection {
    @selectionProperty()
    $class:string = 'ClippedWmsMapSelection';

    @selectionProperty() // may need to use get/set pattern
    service:string = 'si-x'; // si-x || agdd
    @selectionProperty()
    layer:ClippedLayerDef = SIX_LAYERS[0];
    @selectionProperty()
    fwsBoundary:string;
    @selectionProperty()
    useBufferedBoundary:boolean = false;

    legend:WmsMapLegend;
    overlay:ImageOverlay;
    data:WmsMapSelectionData;
    private features:any[];

    constructor(protected http:Http,
                protected cache:CacheService,
                protected datePipe:DatePipe,
                protected mapLegendService:WmsMapLegendService,
                protected config:NpnConfiguration) {
        super();
    }

    isValid():boolean {
        return (this.service === 'si-x' || this.service === 'agdd') && !!this.layer && !!this.fwsBoundary;
    }

    get validServices(): any[] {
        return [{
            value: 'si-x',
            label: 'Spring index'
        },{
            value: 'agdd',
            label: 'Accumulated growing degree days'
        }];
    }
    get validLayers(): any[] {
        switch(this.service) {
            case 'si-x':
                return SIX_LAYERS;
            case 'agdd':
                return AGDD_LAYERS;
        }
        return [];
    }

    get apiDate(): string {
        // always "today" or 6 days in the future for forecast
        let d = new Date();
        if(this.layer && this.layer.forecast) {
            d.setTime(d.getTime()+(6*ONE_DAY_MILLIS));
        }
        return this.datePipe.transform(d,'y-MM-dd');
    }

    private cachedGet(url: string, params:any): Promise<any> {
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
                        data = response.json() as any;
                        this.cache.set(cacheKey,data);
                        resolve(data);
                    })
                    .catch(reject);
            }
        });
    }

    getBoundary(): Promise<any> {
        return new Promise((resolve,reject) => {
            let url = `${this.config.dataApiRoot}/v0/si-x/area/boundary`,
                params = {
                    format: 'geojson',
                    fwsBoundary: this.fwsBoundary
                };
            this.cachedGet(url,params)
                .then(response => {
                    if(response && response.boundary) {
                        this.cachedGet(response.boundary,{}).then(resolve).catch(reject);
                    } else {
                        reject('missing boundary in response.');
                    }
                })
                .catch(reject);
        });
    }

    getData(): Promise<any> {
        let url = `${this.config.dataApiRoot}/v0/${this.layer.clippingService}`,
            params = {
                layerName: this.layer.layerName,
                fwsBoundary: this.fwsBoundary,
                date: this.apiDate,
                useBufferedBoundary: this.useBufferedBoundary,
                style: true,
                fileFormat: 'png'
            };
        return this.cachedGet(url,params);
    }

    getStatistics(): Promise<any> {
        return new Promise((resolve,reject) => {
            let url = `${this.config.dataApiRoot}/v0/${this.layer.statisticsService}`,
                params = {
                    layerName: this.layer.layerName,
                    fwsBoundary: this.fwsBoundary,
                    date: this.apiDate,
                    useBufferedBoundary: this.useBufferedBoundary,
                    useCache: true
                };
            if(this.layer.statsParams) {
                params = {...params,...this.layer.statsParams};
            }
            this.cachedGet(url,params)
                .then(stats => {
                    // translate the date string to a date object.
                    let dateParts = /^(\d{4})-(\d{2})-(\d{2})/.exec(stats.date);
                    stats.date = new Date(
                        parseInt(dateParts[1]),
                        parseInt(dateParts[2])-1,
                        parseInt(dateParts[3])
                    );
                    resolve(stats);
                })
                .catch(reject);
        });

    }

    getAllData(): Promise<WmsMapSelectionData> {
        return new Promise((resolve,reject) => {
            Promise.all([
                this.getData(),
                this.getBoundary(),
                this.getStatistics()
            ])
            .then(arr => {
                resolve({
                    data: arr[0],
                    boundary: arr[1],
                    statistics: arr[2]
                });
            })
            .catch(reject);
        });
    }

    resizeMap(map: google.maps.Map): Promise<any> {
        return new Promise(resolve => {
            if(this.data) {
                let bounds = this.toBounds(this.data.data.bbox);
                if(bounds) {
                    map.fitBounds(bounds);
                }
            }
            resolve();
        });
    }

    removeFrom(map: google.maps.Map): Promise<any> {
        return new Promise(resolve => {
            if(this.overlay) {
                this.overlay.remove();
            }
            (this.features||[]).forEach(f => {
                map.data.remove(f);
            });
            this.data = undefined;
            this.features = undefined;
            this.overlay = undefined;
            this.legend = undefined;
            resolve();
        });
    }

    addTo(map: google.maps.Map): Promise<any> {
        return new Promise((_resolve,_reject) => {
            this.working = true;
            let resolve = (d?:any) => {
                    this.working = false;
                    _resolve(d);
                },
                reject = (e?:any) => {
                    this.working = false;
                    _reject(e);
                };
            if(this.overlay && this.features) {
                return reject('already added to map, call removeFrom');
            }
            this.getAllData()
                .then(all => {
                    if(this.overlay && this.features) {
                        console.log('in promise, already have overlay and features');
                        return resolve();
                    }
                    this.data = all;
                    let data = all.data,
                        bounds = this.toBounds(data.bbox),
                        clippedImage = data.clippedImage;
                    if(bounds) {
                        map.panTo(bounds.getCenter());
                        /*
                        let rect = new google.maps.Rectangle({
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                            map: map,
                            bounds: bounds
                        });*/
                        map.fitBounds(bounds);

                        // have to do this so that the google api classes aren't
                        // touched too early and our class extension invalid
                        lazyClassLoader();

                        this.overlay = new ImageOverLayImpl(bounds,clippedImage,map);
                        this.overlay.add();

                        let geoJson = all.boundary;
                        console.log('MAP boundary resonse',geoJson);
                        this.features = map.data.addGeoJson(geoJson);
                        map.data.setStyle(feature => {
                            return {
                                strokeColor: '#000000',
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: '#FF0000',
                                fillOpacity: 0.0,
                            };
                        });
                    }
                    this.mapLegendService.getLegend(data.layerClippedFrom)
                        .then(legend => {
                            console.debug('ClippedWmsMapSelection.legend:',legend);
                            this.legend = legend;
                            resolve();
                        })
                        .catch(reject);
                })
                .catch(reject);
        });

    }

    private toBounds(bbox:number[]): google.maps.LatLngBounds {
        if(bbox && bbox.length === 4) {
            let sw_lng = bbox[0],
                sw_lat = bbox[1],
                ne_lng = bbox[2],
                ne_lat = bbox[3];
            return new google.maps.LatLngBounds(
              new google.maps.LatLng(sw_lat,sw_lng),
              new google.maps.LatLng(ne_lat,ne_lng)
            );
            /*
            let coords = /^BOX\(\s*(-?\d+\.\d+)\s+(-?\d+\.\d+),\s*(-?\d+\.\d+)\s+(-?\d+\.\d+)\s*\)/.exec(this.box);
            if(coords.length === 5) {
                let sw_lng = parseFloat(coords[1]),
                    sw_lat = parseFloat(coords[2]),
                    ne_lng = parseFloat(coords[3]),
                    ne_lat = parseFloat(coords[4]);
                return new google.maps.LatLngBounds(
                  new google.maps.LatLng(sw_lat,sw_lng),
                  new google.maps.LatLng(ne_lat,ne_lng)
                );
            }*/
        }
        return null;
    }
    // lat + N of equator, - S of equator
    // lng + E of meridian - W of meridian
}

interface ClippedLayerDef {
    label: string;
    layerName: string;
    clippingService: string;
    statisticsService: string;
    statsParams?: any;
    forecast?: boolean;
}

interface ClippedImageResponse {
    date: string;
    layerClippedFrom: string;
    clippedImage: string;
    bbox: number [];
}

interface WmsMapSelectionData {
    data: ClippedImageResponse;
    boundary: any; // geoJson
    statistics: any;
};

interface ImageOverlay extends google.maps.OverlayView,WmsMapSupportsOpacity {
    add();
    remove();
}
let ImageOverLayImpl: { new (bounds: google.maps.LatLngBounds, image: string, map: google.maps.Map): ImageOverlay };

function lazyClassLoader() {
    ImageOverLayImpl = class ImageOverLayImpl extends google.maps.OverlayView implements ImageOverlay {
        bounds: google.maps.LatLngBounds;
        image: string;
        map: google.maps.Map;
        div_:any;
        opacity:number = 0.75;

        constructor(bounds: google.maps.LatLngBounds, image: string, map: google.maps.Map) {
            super();
            this.bounds = bounds;
            this.image = image;
            this.map = map;
        }

        add() {
            this.setMap(this.map);
        }

        remove() {
            this.setMap(null);
        }

        setOpacity(o:number) {
            this.opacity = o;
            if(this.div_) {
                this.div_.style.opacity = o;
            }
        }

        getOpacity():number {
            return this.opacity;
        }

        onAdd() {
            let div = document.createElement('div');
            div.style.borderStyle = 'none';
            div.style.borderWidth = '0px';
            div.style.position = 'absolute';

            // Create the img element and attach it to the div.
            let img = document.createElement('img');
            img.src = this.image;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.position = 'absolute';
            div.appendChild(img);

            this.div_ = div;

            // Add the element to the "overlayLayer" pane.
            var panes = this.getPanes();
            panes.overlayLayer.appendChild(div);
            this.setOpacity(this.opacity);
        }

        draw() {
            // We use the south-west and north-east
            // coordinates of the overlay to peg it to the correct position and size.
            // To do this, we need to retrieve the projection from the overlay.
            var overlayProjection = this.getProjection();

            // Retrieve the south-west and north-east coordinates of this overlay
            // in LatLngs and convert them to pixel coordinates.
            // We'll use these coordinates to resize the div.
            var sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
            var ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());

            // Resize the image's div to fit the indicated dimensions.
            var div = this.div_;
            div.style.left = sw.x + 'px';
            div.style.top = ne.y + 'px';
            div.style.width = (ne.x - sw.x) + 'px';
            div.style.height = (sw.y - ne.y) + 'px';
        }

        onRemove() {
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
        }
    }
}
