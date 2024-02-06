import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import LayerSwitcher, {
  BaseLayerOptions,
  GroupLayerOptions,
} from 'ol-layerswitcher';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import BingMaps from 'ol/source/BingMaps';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import Map from 'ol/Map';
import { Overlay, View } from 'ol';
import { fromLonLat } from 'ol/proj';

/* IMPORTACION DEL VECTOR */
import { Geometry, Point } from 'ol/geom';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {
  Circle as CircleStyle,
  Style,
  Text,
  Fill,
  Stroke,
  Icon,
} from 'ol/style';
import { FichaFamiliarService } from 'src/app/protected/apiservice/ficha-familiar.service';
import { AuthService } from 'src/app/auth/service/auth.service';
import { ProfessionalService } from 'src/app/protected/apiservice/professional.service';
import {
  BrigadaEAIS,
  InfoEais,
  Profesional,
} from 'src/app/protected/prointerfaces/api.interface';
import { InfoEaisService } from 'src/app/protected/apiservice/info-eais.service';
import { UtilService } from 'src/app/sevices/util.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eais-information',
  templateUrl: './eais-information.component.html',
  styleUrls: ['./eais-information.component.css'],
})
export class EaisInformationComponent implements OnInit {
  get user_auth_info() {
    return this.authService.currentlyUser();
  }

  /* FILTER CEDULA */
  cedula: any;

  /* INDICADOR PREGNAT */
  pregnats: any;

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
  vectorLayer = new VectorLayer();

  selectedView: number[] = [-78.578301, -1.737083];

  eaisEU03: number[] = [-78.596324, -1.73096];
  eaisER13: number[] = [-78.620326, -1.728806];
  eaisER45: number[] = [-78.558578, -1.737602];
  eaisER51: number[] = [-78.585614, -1.758539];
  eaisER15: number[] = [-78.608949, -1.729919];

  /* FIXME: ARRAY PARA EDADES PARA NG SELECT PARA FILTROS */
  array_ages: any = [];
  array_years: any = [];
  array_rbiologicals: any = [];
  array_renvironmentals: any = [];
  array_rsocioeconomics: any = [];
  array_gprioritys: any = [];
  array_gvulnerables: any = [];

  /* VARIABLES PARA ALMACENAR DATOS DE SELECT */
  select_year: any;
  select_age: any;
  select_rbiological: any;
  select_renvironmental: any;
  select_socioeconomic: any;
  select_gpriority: any;
  select_gvulnerable: any;

  constructor(
    private _fichaFamiliarService: FichaFamiliarService,
    private authService: AuthService,
    private professionalService: ProfessionalService,
    private infoEaisService: InfoEaisService,
    private _utilService: UtilService,
    private _toastr: ToastrService
  ) {}

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
      key: 'AtmNrEkB6w4FcBahS6VsMXO6d0wtpBTfuP8RH_OozswG1YwruAkVk6_B4LVtJKBe',
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
    target: 'map',
    layers: [this.baseMaps, this.overLays],
  });

  layerSwitcher = new LayerSwitcher({
    reverse: true,
    groupSelectStyle: 'group',
  });

  async ngOnInit() {
    if (this.user_auth_info?.id_Profesional) {
      this.professionalService
        .shearchProfessionalinApi(this.user_auth_info.id_Profesional)
        .subscribe({
          next: (response) => {
            this.professionalInformation = response;
            console.log(this.professionalInformation);
            this.professionalEais = response.brigadaEai;
            console.log(this.professionalEais);
            this.getActiveEAIS(this.professionalEais);
            console.log(this.activeBrigadeEaisInfo);
            console.log(this.activeBrigadeEaisInfo!.eais.cod_eais);
            this.matchProfessionalToMap(
              this.activeBrigadeEaisInfo!.eais.cod_eais
            );
          },
          error: (err) => {
            console.log(err.error);
          },
        });
    }

    for (let index = 2000; index <= 2100; index++) {
      this.array_years.push({ value: index, label: `${index} ` });
    }
    for (let index = 1; index <= 100; index++) {
      this.array_ages.push({ value: index, label: `${index} ` });
    }
    const data = await this._fichaFamiliarService.getCategories();

    this.array_rbiologicals = data.risk_biological;
    this.array_renvironmentals = data.risk_environmental;
    this.array_rsocioeconomics = data.risk_socioeconomic;
    this.array_gprioritys = data.group_priority;
    this.array_gvulnerables = data.group_vulnerable;

    this.coordinates = await this._fichaFamiliarService.getLocation();
    console.log(this.coordinates);
    this.drawMap();

    /* PREGNTA */
    this.pregnats = await this._fichaFamiliarService.getPregnats();
    console.log(this.pregnats);
  }

  /* METODO PARA CONTROLAR BRIGADE por MAP  */
  getActiveEAIS(brigades: BrigadaEAIS[]) {
    this.activeBrigadeEaisInfo = brigades.find(
      (brigade) => brigade.state === true
    );
    /* if (this.activeBrigadeEaisInfo) {
      this.getEaisInfo(this.activeBrigadeEaisInfo.eais.id_eais);
    } */
  }

  /* getEaisInfo(id: string) {
    this.infoEaisService.searchInfoEaisInApi(id).subscribe({
      next: (response) => {
        this.eaisInformation = response;
        console.log(this.eaisInformation);
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  } */

  /* TODO: dibujar mapa */
  drawMap() {
    let chamboCoordenadas: any = [];

    this.coordinates.forEach((element: any) => {
      const object = {
        coordenate: fromLonLat([element.longitud1, element.latitud1]),
        color: element.color,
        name: element.name,
        age: element.age,
        genero: element.genero,
        cedula: element.cedula,
        celular: element.celular,
        icon: element.icon,
      };
      chamboCoordenadas.push(object);
    });

    this.points = chamboCoordenadas.map((coordenate: any) => {
      const features = new Feature({
        geometry: new Point(coordenate.coordenate),
      });

      features.setProperties({
        name: coordenate.name,
        age: coordenate.age,
        genero: coordenate.genero,
        cedula: coordenate.cedula,
        celular: coordenate.celular,
      });

      features.setStyle(this.generateStyle(coordenate));
      return features;
    });

    this.vectorSource = new VectorSource({
      features: this.points,
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.map = new Map({
      target: 'map',
      layers: [this.baseMaps, this.overLays, this.vectorLayer],
      view: new View({
        center: fromLonLat([this.selectedView[0], this.selectedView[1]]),
        zoom: 14.8,
      }),
    });

    this.map.addControl(this.layerSwitcher);

    /* PARA MOSTRAR INFOR ---------------------------------------------- */
    this.overlay = new Overlay({
      element: this.popupContainer?.nativeElement,
      positioning: 'center-center',
      offset: [0, -60],
    });

    this.map.addOverlay(this.overlay);

    this.map.on('click', (evt) => {
      let feature = this.map.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
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

  async filter(data?: any) {
    /* para ver total embarazadas por a;o */
    if (this.select_year) {
      console.log('Entro a year');
      this.pregnats = await this._fichaFamiliarService.getPregnats(
        this.select_year
      );
      console.log('PREGNATS =>', this.pregnats);
    }
    if (data) {
      this.coordinates = data;
    } else {
      console.log(this.select_rbiological);
      this.cedula = '';
      this.coordinates = await this._fichaFamiliarService.getLocation(
        this.select_year,
        this.select_age,
        this.select_rbiological,
        this.select_renvironmental,
        this.select_socioeconomic,
        this.select_gpriority,
        this.select_gvulnerable
      );
    }

    const vector = this.vectorLayer.getSource();
    vector?.clear();

    let coordinatesNew: any = [];

    this.coordinates.forEach((element: any) => {
      const object = {
        coordenate: fromLonLat([element.longitud1, element.latitud1]),
        color: element.color,
        name: element.name,
        age: element.age,
        genero: element.genero,
        cedula: element.cedula,
        celular: element.celular,
        icon: element.icon,
      };

      coordinatesNew.push(object);
    });

    console.log(this.coordinates);
    coordinatesNew.forEach((element: any) => {
      const newFeatures = new Feature({
        geometry: new Point(element.coordenate),
      });

      newFeatures.setProperties({
        name: element.name,
        age: element.age,
        genero: element.genero,
        cedula: element.cedula,
        celular: element.celular,
      });

      /*  newFeatures.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: 'white' }),
            stroke: new Stroke({ color: element.color, width: 1 }),
            scale: 1.5,
          }),
          zIndex: 0,
        })
      ); */

      newFeatures.setStyle(this.generateStyle(element));

      this.vectorSource.addFeature(newFeatures);
    });
  }

  matchProfessionalToMap(eais: string) {
    switch (eais) {
      case '06D01ER13':
        this.selectedView = this.eaisER13;
        this.eaisLayer.setSource(
          new TileWMS({
            url: 'http://localhost:8080/geoserver/mpwebapp/wms',
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
            url: 'http://localhost:8080/geoserver/mpwebapp/wms',
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
            url: 'http://localhost:8080/geoserver/mpwebapp/wms',
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
            url: 'http://localhost:8080/geoserver/mpwebapp/wms',
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
            url: 'http://localhost:8080/geoserver/mpwebapp/wms',
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

  async filterCedula() {
    console.log('cedula', this.cedula);

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
}
