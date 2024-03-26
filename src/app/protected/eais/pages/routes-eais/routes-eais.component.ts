import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Feature, Overlay, View } from 'ol';
import LayerSwitcher, {
  BaseLayerOptions,
  GroupLayerOptions,
} from 'ol-layerswitcher';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import BingMaps from 'ol/source/BingMaps';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import { AuthService } from 'src/app/auth/service/auth.service';
import { FichaFamiliarService } from 'src/app/protected/apiservice/ficha-familiar.service';
import { InfoEaisService } from 'src/app/protected/apiservice/info-eais.service';
import { ProfessionalService } from 'src/app/protected/apiservice/professional.service';
import {
  BrigadaEAIS,
  InfoEais,
  Profesional,
} from 'src/app/protected/prointerfaces/api.interface';
import { UtilService } from 'src/app/sevices/util.service';
import TileWMS from 'ol/source/TileWMS';
import { fromLonLat, transform } from 'ol/proj';
import { LineString, Point } from 'ol/geom';
import { Fill, Icon, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { Loading, Report } from 'notiflix';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-routes-eais',
  templateUrl: './routes-eais.component.html',
  styleUrls: ['./routes-eais.component.css'],
})
export class RoutesEaisComponent implements OnInit {
  get user_auth_info() {
    return this.authService.currentlyUser();
  }

  /* RUTAS */
  pointsArray: string[] = [];
  features: Feature[] = [];
  layers: VectorLayer<VectorSource>[] = [];

  routeDistance: string = '';
  routeTime: string = '';

  showRoutesDetails: boolean = false;

  /* BUSQUEDA  */
  cedula: any;

  /* VARIABLE DE EJEMPLO SHOW PAC  */
  @ViewChild('popup') popupContainer!: ElementRef;
  /* -------------------------------------------- */

  professionalInformation: Profesional = Object.create([]);
  activeBrigadeEaisInfo: BrigadaEAIS | undefined = undefined;
  professionalEais: BrigadaEAIS[] = [];
  eaisInformation: InfoEais = Object.create([]);

  coordinates: any;
  vectorSource = new VectorSource();
  points: any;
  vectorLayer = new VectorLayer({ source: new VectorSource() });

  /* RUTAS */

  routeLayer = new VectorLayer({
    source: new VectorSource(),
  });

  //OpenRouteService
  orsApiKey: string =
    '5b3ce3597851110001cf6248439523c5ce334f789bdb3ff9b4291333';

  selectedView: number[] = [-78.578301, -1.737083];

  eaisEU03: number[] = [-78.596324, -1.73096];
  eaisER13: number[] = [-78.620326, -1.728806];
  eaisER45: number[] = [-78.558578, -1.737602];
  eaisER51: number[] = [-78.585614, -1.758539];
  eaisER15: number[] = [-78.608949, -1.729919];

  /* ----------------------------------- */
  overlay!: Overlay;
  showPopup: boolean = false;
  /* ----------------------------------- */

  relieveLayer = new TileLayer({
    title: 'Relieve',
    type: 'base',
    combine: true,
    visible: true,
    source: new OSM(),
  } as BaseLayerOptions);

  sateliteLayer = new TileLayer({
    title: 'Satélite',
    type: 'base',
    combine: true,
    visible: false,
    source: new BingMaps({
      key: 'Aiwl9vkGFDhpasG4UwDhC_cDPJ4PvqSG5RcEY-D4wgeYeNWHJvQTF52hfyCL54tM',
      imagerySet: 'AerialWithLabelsOnDemand',
    }),
    opacity: 0.85,
  } as BaseLayerOptions);

  eaisLayer = new TileLayer({
    visible: true,
  } as BaseLayerOptions);

  baseMaps = new LayerGroup({
    title: 'Capas',
    layers: [this.sateliteLayer, this.relieveLayer],
  } as GroupLayerOptions);

  overLays = new LayerGroup({
    title: 'Mapa Base',
    fold: 'open',
    layers: [this.eaisLayer],
  } as GroupLayerOptions);

  map = new Map({
    layers: [this.baseMaps, this.overLays],
  });

  layerSwitcher = new LayerSwitcher({
    reverse: true,
    groupSelectStyle: 'group',
  });

  constructor(
    private _fichaFamiliarService: FichaFamiliarService,
    private authService: AuthService,
    private professionalService: ProfessionalService,
    private infoEaisService: InfoEaisService,
    private _utilService: UtilService,
    private _toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    Loading.dots();
    if (this.user_auth_info?.id_Profesional) {
      this.professionalService
        .shearchProfessionalinApi(this.user_auth_info.id_Profesional)
        .subscribe({
          next: (response) => {
            this.professionalInformation = response;

            this.professionalEais = response.brigadaEai;

            this.getActiveEAIS(this.professionalEais);
            if (this.activeBrigadeEaisInfo) {
              this.matchProfessionalToMap(
                this.activeBrigadeEaisInfo!.eais.cod_eais
              );

              this.map = new Map({
                target: 'rutaseais',
                layers: [
                  this.baseMaps,
                  this.overLays,
                  this.vectorLayer,
                  ...this.layers,
                ],
                view: new View({
                  center: fromLonLat([
                    this.selectedView[0],
                    this.selectedView[1],
                  ]),
                  zoom: 14.9,
                }),
              });

              this.map.addControl(this.layerSwitcher);
            } else {
              Report.failure(
                'NO DISPONIBLE',
                'Lo sentimos, usted no tiene una Brigada EAIS asignada para cargar la data, comuníquese con el administrador.',
                'Volver'
              );
            }
          },
          error: (err) => {
            Report.failure(
              'Algo ha salido mal',
              `Detalles: ${err.error.message}.`,
              'Volver'
            );
          },
        });
    }
    Loading.remove();
  }

  getActiveEAIS(brigades: BrigadaEAIS[]) {
    this.activeBrigadeEaisInfo = brigades.find(
      (brigade) => brigade.state === true
    );
  }

  async filter(datac?: any) {
    Loading.circle();
    if (datac) {
      this.coordinates = datac[0];
      if (this.coordinates) {
        let feature = new Feature({
          geometry: new Point(
            fromLonLat([this.coordinates.longitud1, this.coordinates.latitud1])
          ),
        });

        feature.setProperties({
          name: this.coordinates.name,
          age: this.coordinates.age,
          genero: this.coordinates.genero,
          cedula: this.coordinates.cedula,
          celular: this.coordinates.celular,
        });

        feature.setStyle(this.generateStyle(this.coordinates));

        this.vectorLayer.getSource()?.addFeature(feature);

        /* PARA MOSTRAR INFOR ---------------------------------------------- */
        this.overlay = new Overlay({
          element: this.popupContainer?.nativeElement,
          positioning: 'center-center',
          offset: [0, -60],
        });

        this.map.addOverlay(this.overlay);

        const vectorLayer = this.vectorLayer;

        this.map.on('pointermove', (evt) => {
          let feature = this.map.forEachFeatureAtPixel(
            evt.pixel,
            function (feature, layer) {
              if (layer === vectorLayer) {
                return feature;
              }
              return null;
            }
          );

          if (feature) {
            var geometry = feature.getGeometry();
            if (geometry instanceof Point) {
              var coordinates = geometry.getCoordinates();
              this.overlay.setPosition(coordinates);

              // Obtiene la información adicional

              let name = feature.get('name');
              let age = feature.get('age');
              let genero = feature.get('genero');
              let cedula = feature.get('cedula');
              let celular = feature.get('celular');

              // Crea el contenedor HTML
              this.popupContainer.nativeElement.innerHTML = `
              <div>
              <h2 class="font-semibold">${name}</h2>
              <p>Cedula: ${cedula}</p>
              <p>Edad: ${age}</p>
              <p>Genero: ${genero}</p>
              <p>Celular: ${celular}</p>
              </div>
            `;

              this.showPopup = true;
            }
          } else {
            this.overlay.setPosition(undefined);
            this.showPopup = false;
          }
        });
      }
    } else {
      this.cedula = '';
      const vector = this.vectorLayer.getSource();
      vector?.clear();
    }
    Loading.remove();
  }

  async filterCedula() {
    if (!this._utilService.validateIdentityCard(this.cedula)) {
      this._utilService.toastWarning('Cedula Ingresada no Valida');
      return;
    }
    this.coordinates = await this._fichaFamiliarService.getSearchId(
      `cedula=${this.cedula}`
    );

    if (!(this.coordinates.length > 0)) {
      this._utilService.toastInformation(
        'No se encontro un registro en el criterio de busqueda'
      );

      return;
    }

    this.filter(this.coordinates);
  }

  matchProfessionalToMap(eais: string) {
    switch (eais) {
      case '06D01ER13':
        this.selectedView = this.eaisER13;
        this.eaisLayer.setSource(
          new TileWMS({
            url: 'http://181.112.226.43:8080/geoserver/mpapp/wms',
            params: { LAYERS: 'EAIS,GEO_LOC', TILED: true },
            serverType: 'geoserver',
            transition: 2.0,
          })
        );
        this.eaisLayer.set('title', 'EAIS ER13');
        break;
      case '06D01ER15':
        this.selectedView = this.eaisER15;
        this.eaisLayer.setSource(
          new TileWMS({
            url: 'http://181.112.226.43:8080/geoserver/mpapp/wms',
            params: { LAYERS: 'EAIS,GEO_LOC', TILED: true },
            serverType: 'geoserver',
            transition: 2.0,
          })
        );
        this.eaisLayer.set('title', 'EAIS ER15');
        break;
      case '06D01ER51':
        this.selectedView = this.eaisER51;
        this.eaisLayer.setSource(
          new TileWMS({
            url: 'http://181.112.226.43:8080/geoserver/mpapp/wms',
            params: { LAYERS: 'EAIS,GEO_LOC', TILED: true },
            serverType: 'geoserver',
            transition: 2.0,
          })
        );
        this.eaisLayer.set('title', 'EAIS ER51');
        break;
      case '06D01ER45':
        this.selectedView = this.eaisER45;
        this.eaisLayer.setSource(
          new TileWMS({
            url: 'http://181.112.226.43:8080/geoserver/mpapp/wms',
            params: { LAYERS: 'EAIS', TILED: true },
            serverType: 'geoserver',
            transition: 2.0,
          })
        );
        this.eaisLayer.set('title', 'EAIS ER45');
        break;
      case '06D01EU03':
        this.selectedView = this.eaisEU03;
        this.eaisLayer.setSource(
          new TileWMS({
            url: 'http://181.112.226.43:8080/geoserver/mpapp/wms',
            params: { LAYERS: 'EAIS,GEO_LOC', TILED: true },
            serverType: 'geoserver',
            transition: 2.0,
          })
        );
        this.eaisLayer.set('title', 'EAIS EU03');
        break;

      default:
        break;
    }
  }

  generateStyle(coordenate: any) {
    const circle = new Style({
      image: new CircleStyle({
        radius: 10,
        fill: new Fill({ color: 'white' }),
        stroke: new Stroke({ color: coordenate.color, width: 1 }),
        scale: 1.5,
      }),
      zIndex: 0,
    });

    const icon = new Style({
      image: new Icon({
        src: `assets/icons/${coordenate.icon}`,
        scale: 1,
      }),
      zIndex: 1,
    });

    return [circle, icon];
  }

  getPopupStyle(): string {
    if (this.showPopup) {
      return 'px-2 py-3 text-xs border border-blue-800 border-solid rounded bg-slate-50 ';
    }
    return 'hidden';
  }

  exportPdf() {
    window.print();
  }

  /* RUTAS */

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;

        this.setPoint(longitude + ', ' + latitude, true);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  getCschLocation() {
    const longitude = -78.59797618;
    const latitude = -1.7256123321;

    this.setPoint(longitude + ', ' + latitude, true);
  }

  setPatientLocation() {
    if (this.coordinates.latitud1) {
      const latitude = this.coordinates.latitud1;
      const longitude = this.coordinates.longitud1;

      this.setPoint(longitude + ', ' + latitude, false);
    }
  }

  setPoint(point: string, isStartPoint: boolean) {
    if (this.pointsArray.length === 2) {
      this.map.removeLayer(this.layers[0]);
      this.pointsArray.shift(); // Elimina el primer punto
      this.features.shift(); // Elimina el primer feature
      this.layers.shift(); // Elimina la primera capa
    }
    this.pointsArray.push(point); // Agrega el nuevo punto
    // Crea un nuevo feature y una nueva capa para el punto
    let feature = this.createFeature(point);
    let layer = this.createLayer(feature, isStartPoint);

    this.features.push(feature); // Agrega el nuevo feature
    this.layers.push(layer); // Agrega la nueva capa
    this.map.addLayer(layer);
  }

  createFeature(point: string) {
    let coordinates = point.split(',').map(Number);
    let pointFeature = fromLonLat(coordinates);
    return new Feature({
      type: 'point',
      geometry: new Point(pointFeature),
    });
  }

  createLayer(feature: Feature, isStartPoint: boolean) {
    let iconSrc = isStartPoint
      ? '../../../assets/icons/map_pin.png'
      : '../../../assets/icons/end.png';
    return new VectorLayer<VectorSource>({
      source: new VectorSource({
        features: [feature],
      }),
      style: new Style({
        image: new Icon({
          src: iconSrc,
        }),
      }),
    });
  }

  setPoints() {
    if (this.pointsArray.length === 2) {
      let start = this.pointsArray[0].split(',').map(Number);
      let end = this.pointsArray[1].split(',').map(Number);
      this.getRoute(start, end);
    }
  }

  //Open Route Service
  async getRoute(start: number[], end: number[]) {
    if (start[0] != 0 && end[0] != 0) {
      let url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${this.orsApiKey}&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`;

      this.http.get(url).subscribe({
        next: (response: any) => {
          // Maneja la respuesta aquí

          const vectorRoute = new VectorSource();

          // Borra la ruta anterior
          this.routeLayer.getSource()?.clear();

          // Extrae la geometría de la ruta de la respuesta
          let route = response.features[0].geometry;

          let transformedCoordinates = route.coordinates.map((coord: any) =>
            transform(coord, 'EPSG:4326', 'EPSG:3857')
          );

          // Crea un objeto de la ruta para OpenLayers
          let routeFeature = new Feature({
            type: 'route',
            geometry: new LineString(transformedCoordinates),
          });

          // Añade la ruta al mapa
          vectorRoute.addFeature(routeFeature);

          this.routeLayer = new VectorLayer({
            source: vectorRoute,
            style: new Style({
              stroke: new Stroke({
                color: '#ff0000',
                width: 5,
              }),
            }),
          });

          this.map.addLayer(this.routeLayer);

          // Extrae la distancia y el tiempo de la respuesta
          let distance = response.features[0].properties.segments[0].distance;
          let time = response.features[0].properties.segments[0].duration;

          // Convierte la distancia a kilómetros y el tiempo a minutos
          let distanceInKm = (distance / 1000).toFixed(2);
          let timeInMinutes = (time / 60).toFixed(1);

          this.routeDistance = distanceInKm.toString();
          this.routeTime = timeInMinutes.toString();

          this.showRoutesDetails = true;
        },

        error: (err) => {
          this.routeLayer = new VectorLayer();
        },
      });
    }
  }

  openRouteInGoogleMaps() {
    // Asume que startPoint y pointA son strings con formato 'lat,lon'
    let start = this.pointsArray[0].split(',').map(Number);
    let end = this.pointsArray[1].split(',').map(Number);

    let url = `https://www.google.com/maps/dir/${start[1]},${start[0]}/${end[1]},${end[0]}`;

    window.open(url, '_blank');
  }

  clearRoute() {
    // Borra la ruta anterior

    this.pointsArray = [];
    this.coordinates = [];

    for (let layer of this.layers) {
      // Elimina la capa del mapa
      this.map.removeLayer(layer);
    }
    // Limpia el arreglo de capas de puntos
    this.layers = [];

    this.map.removeLayer(this.routeLayer);

    this.showRoutesDetails = false;

    this.routeDistance = '';
    this.routeTime = '';

    this.cedula = '';
    const vector = this.vectorLayer.getSource();
    vector?.clear();
  }
}
