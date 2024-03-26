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
import { NgSelectConfig } from '@ng-select/ng-select';
import { Loading } from 'notiflix';

@Component({
  selector: 'app-view-map',
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.css'],
})
export class ViewMapComponent implements OnInit {
  showCategories: boolean = false;

  /* INDICADORES */
  cedula: any;
  view_pregntas = false;
  pregnats: any;
  obesity: any;
  malnutrition: any;
  disability: any;
  diseases: any;
  personprior: any;

  //TODO: variables para almacenar tipo de riesgo
  type_pregnats = 0;
  type_obesity: boolean | undefined;
  type_malnutrition = 0;
  type_disability = '';
  type_diseases = 0;
  type_personprior = '';

  view_button = 'Ver fichas';
  view = false;

  /* VARIABLE DE EJEMPLO SHOW PAC  */
  @ViewChild('popup') popupContainer!: ElementRef;
  /* -------------------------------------------- */

  /* MOSTRAR PUNTOS DE LA BD */
  coordinates: any;
  vectorSource = new VectorSource();
  points: any;
  vectorLayer = new VectorLayer();

  /* FIXME: ARRAY PARA MOSTRAR PARA NG SELECT PARA FILTROS */

  gender = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' },
  ];

  array_years: any = [];
  array_ages: any = [];
  array_rbiologicals: any = [];
  array_renvironmentals: any = [];
  array_rsocioeconomics: any = [];
  array_gprioritys: any = [];
  array_gvulnerables: any = [];

  /* VARIABLES PARA ALMACENAR DATOS DE SELECT */
  select_year: any = [];
  select_age: any = [];
  select_gender: any = [];
  select_rbiological: any = [];
  select_renvironmental: any = [];
  select_socioeconomic: any = [];
  select_gpriority: any = [];
  select_gvulnerable: any = [];

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
      key: 'Aiwl9vkGFDhpasG4UwDhC_cDPJ4PvqSG5RcEY-D4wgeYeNWHJvQTF52hfyCL54tM',
      imagerySet: 'AerialWithLabelsOnDemand',
    }),
    opacity: 0.85,
  } as BaseLayerOptions);

  eaisLayer = new TileLayer({
    title: 'EAIS',
    visible: true,
    source: new TileWMS({
      url: 'http://181.112.226.43:8080/geoserver/mpapp/wms',
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
    layers: [this.baseMaps, this.overLays],
  });

  layerSwitcher = new LayerSwitcher({
    reverse: true,
    groupSelectStyle: 'group',
  });

  constructor(
    private _fichaFamiliarService: FichaFamiliarService,
    private _utilService: UtilService,
    private _toastr: ToastrService,
    private ngSelectConfig: NgSelectConfig
  ) {
    ngSelectConfig.appendTo = 'body';
  }

  async ngOnInit() {
    Loading.dots();

    for (let index = 2000; index <= 2100; index++) {
      this.array_years.push({ value: index, label: `${index} ` });
    }

    for (let index = 0; index <= 115; index++) {
      this.array_ages.push({ value: index, label: `${index} ` });
    }

    const data = await this._fichaFamiliarService.getCategories();

    this.array_rbiologicals = data.risk_biological;
    this.array_renvironmentals = data.risk_environmental;
    this.array_rsocioeconomics = data.risk_socioeconomic;
    this.array_gprioritys = data.group_priority;
    this.array_gvulnerables = data.group_vulnerable;

    this.coordinates = await this._fichaFamiliarService.getLocation();

    this.drawMap();

    /* PREGNTA */
    this.pregnats = await this._fichaFamiliarService.getPregnats();

    /* OBESITY */
    this.obesity = await this._fichaFamiliarService.getObesityChildren();

    /* MALNUTRITION */
    this.malnutrition =
      await this._fichaFamiliarService.getMalnutritionChildren();

    /* DISCAPACIDADES */
    this.disability = await this._fichaFamiliarService.getDisability();

    /* ENFERMEDADES */
    this.diseases = await this._fichaFamiliarService.getDiseases();

    /* PERSONAS EN EL GRUPO PRIORITARIO */
    this.personprior = await this._fichaFamiliarService.getPersonPrior();

    Loading.remove();
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
        riesgo: element.riesgo,
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
      target: 'mapa',
      layers: [this.baseMaps, this.overLays, this.vectorLayer],
      view: new View({
        center: fromLonLat([-78.546613, -1.747513]),
        zoom: 12.8,
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
    const vector = this.vectorLayer.getSource();
    vector?.clear();
    this.map.on('pointermove', (evt) => {
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

          let name = feature.get('name');
          let age = feature.get('age');
          let genero = feature.get('genero');
          let cedula = feature.get('cedula');
          let celular = feature.get('celular');

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
    Loading.circle();
    if (this.select_year) {
      this.pregnats = await this._fichaFamiliarService.getPregnats(
        this.select_year
      );

      this.obesity = await this._fichaFamiliarService.getObesityChildren(
        this.select_year
      );

      this.malnutrition =
        await this._fichaFamiliarService.getMalnutritionChildren(
          this.select_year
        );

      this.disability = await this._fichaFamiliarService.getDisability(
        this.select_year
      );

      this.diseases = await this._fichaFamiliarService.getDiseases(
        this.select_year
      );

      this.personprior = await this._fichaFamiliarService.getPersonPrior(
        this.select_year
      );
    }
    if (data) {
      this.coordinates = data;
    } else {
      this.cedula = '';
      this.coordinates = await this._fichaFamiliarService.getLocation(
        this.select_year,
        this.select_age,
        this.select_gender,
        this.select_rbiological,
        this.select_renvironmental,
        this.select_socioeconomic,
        this.select_gpriority,
        this.select_gvulnerable
      );

      /* PRUEBA NOTIFICACIONES  */
      if (!(this.coordinates.length > 0)) {
        this._utilService.toastInformation(
          'No se encontraron datos para mostrar'
        );
        Loading.remove();
      }
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
        riesgo: element.riesgo,
      };
      coordinatesNew.push(object);
    });

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

    /*  if (
      this.select_year?.length == 0 &&
      this.select_age?.length == 0 &&
      this.select_gender?.length == 0 &&
      this.select_rbiological?.length == 0 &&
      this.select_renvironmental?.length == 0 &&
      this.select_socioeconomic?.length == 0 &&
      this.select_gpriority?.length == 0 &&
      this.select_gvulnerable?.length == 0 &&
      !this.cedula &&
      !this.view &&
      !this.view_pregntas &&
      this.type_obesity == undefined &&
      this.type_malnutrition == 0 &&
      this.type_disability === '' &&
      this.type_diseases == 0 &&
      this.type_personprior == ''
    ) {
      const vector = this.vectorLayer.getSource();
      vector?.clear();
    } */
    if (
      !this.select_year?.length &&
      !this.select_age?.length &&
      !this.select_gender?.length &&
      !this.select_rbiological?.length &&
      !this.select_renvironmental?.length &&
      !this.select_socioeconomic?.length &&
      !this.select_gpriority?.length &&
      !this.select_gvulnerable?.length &&
      !this.cedula &&
      !this.view &&
      !this.view_pregntas &&
      !this.type_obesity &&
      !this.type_malnutrition &&
      !this.type_disability &&
      !this.type_diseases &&
      !this.type_personprior
    ) {
      const vector = this.vectorLayer.getSource();
      vector?.clear();
    }
    Loading.remove();
  }

  generateStyle(coordenate: any) {
    let fillColor = 'white';
    if (coordenate.riesgo === 'rb') {
      fillColor = '#f078a4';
    } else if (coordenate.riesgo === 're') {
      fillColor = '#51ed8f';
    } else if (coordenate.riesgo === 'rs') {
      fillColor = '#f09f4f';
    }

    const circle = new Style({
      image: new CircleStyle({
        radius: 10,
        fill: new Fill({ color: fillColor }),
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
      return 'px-2 py-3 text-xs border border-blue-600 border-solid rounded bg-slate-50 ';
    }

    return 'hidden';
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

  exportPdf() {
    window.print();
  }

  viewData() {
    if (this.view) {
      this.view_button = 'Ver fichas';

      const vector = this.vectorLayer.getSource();
      vector?.clear();
      this.view = false;
    } else {
      this.view_button = 'Ocultar fichas';
      this.filter();
      this.view = true;
    }
  }

  async filterLocationPregntas(type: number, pregnats: string) {
    if (this.type_pregnats == 0) {
      this.type_pregnats = type;
      this.view_pregntas = true;
    } else {
      if (this.type_pregnats == type) {
        this.view_pregntas = false;
        this.type_pregnats = 0;
        const vector = this.vectorLayer.getSource();
        vector?.clear();
        this.filter();
        return;
      } else {
        this.type_pregnats = type;
        this.view_pregntas = true;
      }
    }
    this.coordinates = await this._fichaFamiliarService.getLocationPregnats(
      this.type_pregnats
    );

    if (!(this.coordinates.length > 0)) {
      this._utilService.toastInformation(`No se encontraron ${pregnats}`);
      return;
    }

    this.filter(this.coordinates);
  }

  async filterLocationObesity(type: boolean, message: string) {
    if (this.type_obesity) {
      if (this.type_obesity == type) {
        const vector = this.vectorLayer.getSource();
        vector?.clear();
        this.filter();
        this.type_obesity = undefined;

        return;
      } else {
        this.type_obesity = type;
      }
    } else {
      if (this.type_obesity == type) {
        const vector = this.vectorLayer.getSource();
        vector?.clear();
        this.type_obesity = undefined;
        this.filter();
        return;
      } else {
        this.type_obesity = type;
      }
    }

    this.coordinates = await this._fichaFamiliarService.getLocationObesity(
      this.type_obesity
    );

    if (!(this.coordinates.length > 0)) {
      this._utilService.toastInformation(`No se encontraron ${message}`);
      return;
    }

    this.filter(this.coordinates);
  }

  async filterLocationMalnutrition(type: number, message: string) {
    if (this.type_malnutrition == 0) {
      this.type_malnutrition = type;
    } else {
      if (this.type_malnutrition == type) {
        this.type_malnutrition = 0;
        const vector = this.vectorLayer.getSource();
        vector?.clear();
        this.filter();
        return;
      } else {
        this.type_malnutrition = type;
      }
    }
    this.coordinates = await this._fichaFamiliarService.getLocationMalnutrition(
      this.type_malnutrition
    );

    if (!(this.coordinates.length > 0)) {
      this._utilService.toastInformation(`No se encontraron ${message}`);
      return;
    }

    this.filter(this.coordinates);
  }

  async filterLocationDisability(type: string, message: string) {
    if (this.type_disability == '') {
      this.type_disability = type;
    } else {
      if (this.type_disability == type) {
        this.type_disability = '';
        const vector = this.vectorLayer.getSource();
        vector?.clear();
        this.filter();
        return;
      } else {
        this.type_disability = type;
      }
    }
    this.coordinates = await this._fichaFamiliarService.getLocationDisability(
      this.type_disability
    );

    if (!(this.coordinates.length > 0)) {
      this._utilService.toastInformation(`No se encontraron ${message}`);
      return;
    }

    this.filter(this.coordinates);
  }

  async filterLocationDiseases(type: number, message: string) {
    let query = '';
    let query2 = '';
    switch (type) {
      case 1:
        query = `DIABETES MELLITUS`;
        break;
      case 2:
        query = `HIPERTENSIÓN`;
        break;
      case 3:
        query = 'DIABETES MELLITUS';
        query2 = 'HIPERTENSIÓN';
        break;
    }
    if (this.type_diseases == 0) {
      this.type_diseases = type;
    } else {
      if (this.type_diseases == type) {
        this.type_diseases = 0;
        const vector = this.vectorLayer.getSource();
        vector?.clear();
        this.filter();
        return;
      } else {
        this.type_diseases = type;
      }
    }
    this.coordinates = await this._fichaFamiliarService.getLocationDiseases(
      query,
      query2
    );

    if (!(this.coordinates.length > 0)) {
      this._utilService.toastInformation(`No se encontraron ${message}`);
      return;
    }

    this.filter(this.coordinates);
  }

  async filterLocationPersonPrior(type: string, message: string) {
    if (this.type_personprior == '') {
      this.type_personprior = type;
    } else {
      if (this.type_personprior == type) {
        this.type_personprior = '';
        const vector = this.vectorLayer.getSource();
        vector?.clear();
        this.filter();
        return;
      } else {
        this.type_personprior = type;
      }
    }
    this.coordinates = await this._fichaFamiliarService.getLocationPersonPrior(
      this.type_personprior
    );

    if (!(this.coordinates.length > 0)) {
      this._utilService.toastInformation(`No se encontraron ${message}`);
      return;
    }

    this.filter(this.coordinates);
  }

  toogleCategories() {
    this.showCategories = !this.showCategories;
  }
}
