import {NetworkAwareVisSelection,selectionProperty,ONE_DAY_MILLIS} from '../vis-selection';
import{CacheService} from '../../common';

import {DatePipe} from '@angular/common';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {} from '@types/googlemaps';

import {environment} from '../../environments/environment';

const SIX_LAYERS:ClippedLayerDef[] = [{
    label: 'Current Si-x leaf index',
    layerName: 'si-x:average_leaf_ncep'
},{
    label: '6-day forecast',
    layerName: 'si-x:average_leaf_ncep',
    forecast: true
}/* TODO not yet supported,{
    label: 'Anomaly',
    layerName: 'si-x:average_leaf_ncep',
    forecast: false
}*/];
const AGDD_LAYERS:ClippedLayerDef[] = [
    // TODO add when agdd support arives
];

export class ClippedWmsMapSelection extends NetworkAwareVisSelection {
    @selectionProperty() // may need to use get/set pattern
    service:string = 'si-x'; // si-x || agdd
    @selectionProperty()
    layer:ClippedLayerDef = SIX_LAYERS[0];
    @selectionProperty()
    fwsBoundary:string;

    private data:DataAndBoundary;
    private overlay:ImageOverlay;
    private features:any[];

    constructor(protected http: Http,protected cache: CacheService,protected datePipe: DatePipe) {
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
            let url = `${environment.dataApiRoot}/v0/${this.service}/area/boundary`,
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
        let url = `${environment.dataApiRoot}/v0/${this.service}/area/clippedImage`,
            params = {
                layerName: this.layer.layerName,
                fwsBoundary: this.fwsBoundary,
                date: this.apiDate,
                style: true,
                fileFormat: 'png'
            };
        return this.cachedGet(url,params);
    }

    getDataAndBoundary(): Promise<DataAndBoundary> {
        return new Promise((resolve,reject) => {
            Promise.all([
                this.getData(),
                this.getBoundary()
            ])
            .then(arr => {
                resolve({
                    data: arr[0],
                    boundary: arr[1]
                })
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
            resolve();
        });
    }

    addTo(map: google.maps.Map): Promise<any> {
        return new Promise((resolve,reject) => {
            if(this.overlay && this.features) {
                return reject('already added to map, call removeFrom');
            }
            this.getDataAndBoundary() // and boundary
                .then(dAndb => {
                    if(this.overlay && this.features) {
                        console.log('in promise, already have overlay and features');
                        return resolve();
                    }
                    this.data = dAndb;
                    let data = dAndb.data,
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

                        let geoJson = dAndb.boundary;
                        console.log('MAP boundary resonse',geoJson);
                        this.features = map.data.addGeoJson(geoJson);
                        map.data.setStyle(feature => {
                            return {
                                strokeColor: '#FF0000',
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: '#FF0000',
                                fillOpacity: 0.15,
                            };
                        });
                    }
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
    forecast?:boolean;
}

interface ClippedImageResponse {
    date: string;
    layerClippedFrom: string;
    clippedImage: string;
    bbox: number [];
}

interface DataAndBoundary {
    data: ClippedImageResponse,
    boundary: any // geoJson
};

interface ImageOverlay extends google.maps.OverlayView {
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

        onAdd() {
            var div = document.createElement('div');
            div.style.borderStyle = 'none';
            div.style.borderWidth = '0px';
            div.style.position = 'absolute';

            // Create the img element and attach it to the div.
            var img = document.createElement('img');
            img.src = this.image;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.position = 'absolute';
            div.appendChild(img);

            this.div_ = div;

            // Add the element to the "overlayLayer" pane.
            var panes = this.getPanes();
            panes.overlayLayer.appendChild(div);
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
