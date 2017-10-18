export const MAP_LAYERS = {
    "geo_server": {
        "url": "//geoserver.usanpn.org/geoserver"
    },
    "description" : "",
    "categories": [{
        "name": "Temperature Accumulations, Daily 30-year Average",
        "supports_data": false,
        "legend_label_filter": {
            "name": "legendGddUnits",
            "args": [false]
        },
        "gridded_label_filter": {
            "name": "legendGddUnits",
            "args": [true]
        },
        "extent_default_filter": {
            "name": "agddDefaultTodayElevation"
        },
        "legend_units" : "Growing Degree Days",
        "legend_delimiter_every" : 2000,
        "layers":[{
                "name": "gdd:30yr_avg_agdd"
            },{
                "name": "gdd:30yr_avg_agdd_50f"
            }]
    },{
        "name": "Temperature Accumulations, Current Day",
        "supports_data": false,
        "legend_label_filter": {
            "name": "legendGddUnits",
            "args": [false]
        },
        "gridded_label_filter": {
            "name": "legendGddUnits",
            "args": [true]
        },
        "extent_default_filter": {
            "name": "agddDefaultTodayTime"
        },
        "legend_units" : "Growing Degree Days",
        "legend_delimiter_every" : 2000,
        "supports_time_series": true,
        "layers":[{
                "name": "gdd:agdd"
            },{
                "name": "gdd:agdd_50f"
            }]
    },{
        "name": "Temperature Accumulations, Current Day, Alaska",
        "supports_data": false,
        "legend_label_filter": {
            "name": "legendGddUnits",
            "args": [false]
        },
        "gridded_label_filter": {
            "name": "legendGddUnits",
            "args": [true]
        },
        "extent_values_filter": {
            "name": "extentDates",
            "args": [null,"today"]
        },
        "legend_units" : "Growing Degree Days",
        "legend_delimiter_every" : 2000,
        "layers":[{
            "name": "gdd:agdd_alaska"
        },{
            "name": "gdd:agdd_alaska_50f"
        }]
    },{
        "name": "Temperature Accumulations, Daily Anomaly",
        "supports_data": false,
        "legend_label_filter": {
            "name": "legendAgddAnomaly",
            "args": [false]
        },
        "gridded_label_filter": {
            "name": "legendAgddAnomaly",
            "args": [true]
        },
        "extent_default_filter": {
            "name": "agddDefaultTodayTime"
        },
        "legend_units" : "Growing Degree Days",
        "legend_delimiter_every" : 100,
        "layers":[{
                "name": "gdd:agdd_anomaly"
            },{
                "name": "gdd:agdd_anomaly_50f"
            }]
    },{
        "name": "Spring Indices, Historical Annual",
        "legend_label_filter": {
            "name": "legendDoy"
        },
        "current_year_only": true,
        "layers":[{
				"name": "si-x:average_leaf_prism"
            },{
				"name": "si-x:average_bloom_prism"
            },{
                "name": "si-x:arnoldred_leaf_prism"
            },{
                "name": "si-x:arnoldred_bloom_prism"
            },{
                "name": "si-x:lilac_leaf_prism"
            },{
                "name": "si-x:lilac_bloom_prism"
            },{
                "name": "si-x:zabelli_leaf_prism"
            },{
                "name": "si-x:zabelli_bloom_prism"
            }]
    },{
        "name": "Spring Indices, Current Year",
        "legend_label_filter": {
            "name": "legendDoy"
        },
        "extent_default_filter": {
            "name": "agddDefaultTodayTime"
        },
        "current_year_only": true,
        "layers": [{
				"name": "si-x:average_leaf_ncep"
            },{
				"name": "si-x:average_bloom_ncep"
            },{
                "name": "si-x:arnoldred_leaf_ncep"
            },{
                "name": "si-x:arnoldred_bloom_ncep"
            },{
                "name": "si-x:lilac_leaf_ncep"
            },{
                "name": "si-x:lilac_bloom_ncep"
            },{
                "name": "si-x:zabelli_leaf_ncep"
            },{
                "name": "si-x:zabelli_bloom_ncep"
            }]
    },{
        "name": "Spring Indices, Current Year, Alaska",
        "legend_label_filter": {
            "name": "legendDoy"
        },
        "extent_values_filter": {
            "name": "extentDates",
            "args": [null,"today"]
        },
        "current_year_only": true,
        "layers": [{
            "name": "si-x:average_leaf_ncep_alaska"
        },{
            "name": "si-x:average_bloom_ncep_alaska"
        },{
            "name": "si-x:arnoldred_leaf_ncep_alaska"
        },{
            "name": "si-x:arnoldred_bloom_ncep_alaska"
        },{
            "name": "si-x:lilac_leaf_ncep_alaska"
        },{
            "name": "si-x:lilac_bloom_ncep_alaska"
        },{
            "name": "si-x:zabelli_leaf_ncep_alaska"
        },{
            "name": "si-x:zabelli_bloom_ncep_alaska"
        }]
    },{
        "name": "Spring Indices, Daily Anomaly",
        "supports_data": false,
        "legend_label_filter": {
            "name": "legendSixAnomaly"
        },
        "extent_default_filter": {
            "name": "agddDefaultTodayTime"
        },
        "layers": [{
                "name": "si-x:leaf_anomaly"
            },{
                "name": "si-x:bloom_anomaly"
            }]
    },{
        "name": "Spring Indices, 30-Year Average",
        "legend_label_filter": {
            "name": "legendDoy"
        },
        "extent_default_filter": {
            "name": "agddDefaultTodayElevation"
        },
        "layers": [{
                "name": "si-x:30yr_avg_six_leaf"
            },{
                "name": "si-x:30yr_avg_six_bloom"
            }]
    }]
};

// not safe to change since the capabilities document format changes based on version
// so a version change -may- require code changes wrt interpreting the document
export const WMS_VERSION = '1.1.1';
export const BOX_SIZE = 256;
export const BASE_WMS_ARGS = {
    service: 'WMS',
    request: 'GetMap',
    version: WMS_VERSION,
    layers: undefined, // gets filled in per layer
    styles: '',
    format: 'image/png',
    transparent: true,
    height: BOX_SIZE,
    width: BOX_SIZE,
    srs: 'EPSG:3857' // 'EPSG:4326'
};

export const GEOSERVER_URL = MAP_LAYERS.geo_server.url; // should this go to the environment?
export const WMS_BASE_URL = `${GEOSERVER_URL}/wms`;
export const WMS_CAPABILITIES_URL = `${WMS_BASE_URL}?service=wms&version=${WMS_VERSION}&request=GetCapabilities`;
