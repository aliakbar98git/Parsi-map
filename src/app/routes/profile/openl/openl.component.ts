import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedService } from '@shared/index';
import mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as features from '@mapbox/mapbox-gl-geocoder';
import { json } from 'express';
import { MapService } from '../shared/_services/map.service';
@Component({
  selector: 'app-openl',
  templateUrl: './openl.component.html',
  styleUrls: ['./openl.component.scss'],
  providers: [MapService],
})
export class OpenlComponent implements OnInit, OnDestroy {
  @Output() lonLat = new EventEmitter();
  @ViewChild('parsiMap') parsiMap: ElementRef;
  @Input() lngDisplay;
  @Input() latDisplay;

  eleDisplay;
  sum: any;
  lat;
  lng;
  marker;
  map;

  constructor(
    public sharedService: SharedService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    if (mapboxgl.getRTLTextPluginStatus() !== 'loaded') {
      mapboxgl.setRTLTextPlugin(
        'https://cdn.parsimap.ir/third-party/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js'
      );
    }

    this.showtMapWithLocation(51.41898, 35.70127);

    // SetDaynamicMarkerMap
    this.marker = new mapboxgl.Marker({
      draggable: true,
    });

    this.sharedService.getAddrestIdToMap.subscribe((res) => {
      this.lat = res.data?.latitude;
      this.lng = res.data?.longitude;

      this.map.setCenter([this.lng, this.lat]);
      this.map.setZoom([13]);

      this.sum = this.lat + ',' + this.lng;
      this.marker
        .setLngLat({ lng: res.data.latitude, lat: res.data.longitude })
        .addTo(this.map);
    });
    this.map.on('click', (event) => {
      // this.map.flyTo({ center: event.features[0].geometry.coordinates });

      // When the map is clicked, set the lng and lat constants
      // equal to the lng and lat properties in the returned lngLat object.
      this.lngDisplay = event.lngLat.lat;
      this.latDisplay = event.lngLat.lng;

      this.lonLat.emit(event.lngLat);
      this.marker.setLngLat(event.lngLat).addTo(this.map);
      // you can remove the marker
      this.marker.remove();

      let payload = {
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
      };

      this.mapService.areaInfo(payload).subscribe((res) => {
        this.sharedService.additionalAddressInfo.next(res.data);
      });
    });
  }

  showtMapWithLocation(long, lat) {
    this.map = new mapboxgl.Map({
      container: 'map', // Specify the container ID
      style:
        'https://api.parsimap.ir/styles/parsimap-streets-v11?key=p1372dadf708ac45c5a71e98dde4b79a775a9e4ff7',

      // Specify which map style to use
      center: [long, lat], // Specify the starting position [lng, lat]
      zoom: 10, // Specify the starting zoom
    });
  }

  ngOnDestroy(): void {
    this.map.removeMapInstance();
  }
}
