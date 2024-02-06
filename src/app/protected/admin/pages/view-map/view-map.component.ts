import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Feature, Overlay, View } from 'ol';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import BingMaps from 'ol/source/BingMaps';
import LayerSwitcher, {
  BaseLayerOptions,
  GroupLayerOptions,
} from 'ol-layerswitcher';
import LayerGroup from 'ol/layer/Group';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { FichaFamiliarService } from 'src/app/protected/apiservice/ficha-familiar.service';
import { Point } from 'ol/geom';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { UtilService } from 'src/app/sevices/util.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-map',
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.css'],
})
export class ViewMapComponent implements OnInit {
  /* FILTER CEDULA */
  cedula: any;

  /* INDICADOR PREGNAT */
  pregnats: any;

  /* VARIABLE DE EJEMPLO SHOW PAC  */
  @ViewChild('popup') popupContainer!: ElementRef;
  /* -------------------------------------------- */

  /* MOSTRAR PUNTOS DE LA BD */
  coordinates: any;
  vectorSource = new VectorSource();
  points: any;
  vectorLayer = new VectorLayer();

  /* FIXME: ARRAY PARA MOSTRAR PARA NG SELECT PARA FILTROS */

  /* array_years: any[] = []; */
  array_years: any = [];
  array_ages: any = [];
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
    private _utilService: UtilService,
    private _toastr: ToastrService
  ) {}

  /* VARIABLE PARA EL ESTILO */
  overlay!: Overlay;
  showPopup: boolean = false;

  relieveLayer = new TileLayer({
    title: 'Relieve',
    type: 'base',
    combine: true,
    visible: true,
    source: new OSM(),
  } as BaseLayerOptions);

  topoLayer = new TileLayer({
    title: 'Mapa Topográfico',
    type: 'base',
    combine: true,
    visible: false,
    source: new XYZ({
      url: ' https://tile.opentopomap.org/{z}/{x}/{y}.png',
      crossOrigin: null,
    }),
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
    title: 'EAIS',
    visible: true,
    /*  opacity: 0.5, */
    source: new TileWMS({
      url: 'http://localhost:8080/geoserver/mpwebapp/wms',
      params: { LAYERS: 'CUADRO_EAIS,EAIS,GEO_LOC', TILED: true },
      serverType: 'geoserver',
      transition: 2.0,
    }),
  } as BaseLayerOptions);

  baseMaps = new LayerGroup({
    title: 'Capas',
    layers: [this.topoLayer, this.sateliteLayer, this.relieveLayer],
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
    for (let index = 2000; index <= 2100; index++) {
      this.array_years.push({ value: index, label: `${index} ` });
    }

    /* EJEMPLO AGRUPAR PARA SELECCIONAR TODO */
    /*  this._fichaFamiliarService.getLocation().then((age) => {
      this.array_years = age;
      this.array_years.unshift({ label: 'Todos los a;os', value: 'all' });
    }); */

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
        center: fromLonLat([/* -78.578301, -1.737083 */ -78.57076, -1.75341]),
        zoom: 13.5,
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
    if (this.select_year) {
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

      newFeatures.setStyle(this.generateStyle(element));

      this.vectorSource.addFeature(newFeatures);
    });

    /* METODO PARA SELECCIONAR TODO  */
    /*  if (this.select_year.includes('all')) {
      this.select_year = this.array_years.map((year) => year.value);
    } */
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
