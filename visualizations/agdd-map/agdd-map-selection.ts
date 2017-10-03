import {VisSelection} from '../vis-selection';
import{CacheService} from '../../common';

import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {} from '@types/googlemaps';

export class AgddMapSelection extends VisSelection {
    image: string;
    box: number[];
    boundary: string;

    constructor(protected http: Http,protected cacheService: CacheService) {
        super();
    }
    /*
    // BOX(E N,E N) BOX(lng lat, lng lat) BOX(SW,NE)
    this.agdd1.box = 'BOX(-106.50213020231 40.5170110198478,-106.210591798487 40.9346817640039)';
    */

    addTo(map: google.maps.Map): void {
        let bounds = this.getBounds();
        if(bounds) {
            map.panTo(bounds.getCenter());
            /*let rect = new google.maps.Rectangle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                bounds: bounds
            });*/
            map.fitBounds(bounds);
            lazyClassLoader();
            let overlay = new ImageOverLayImpl(bounds,this.image,map);
            overlay.add();
            if(this.boundary) {
                console.log(`MAP fetching boundary ${this.boundary}`)
                this.http.get(this.boundary)
                    .toPromise()
                    .then(response => {
                        let geoJson = response.json();
                        console.log('MAP boundary resonse',geoJson);
                        map.data.addGeoJson(geoJson);
                        map.data.setStyle(feature => {
                            return {
                                strokeColor: '#FF0000',
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: '#FF0000',
                                fillOpacity: 0.15,
                            };
                        });
                    });
            }
        }
    }

    getBounds(): google.maps.LatLngBounds {
        if(this.box && this.box.length === 4) {
            let sw_lng = this.box[0],
                sw_lat = this.box[1],
                ne_lng = this.box[2],
                ne_lat = this.box[3];
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

interface ImageOverlay extends google.maps.OverlayView {
    add();
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
