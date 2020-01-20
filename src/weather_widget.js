import Glide from '@glidejs/glide';
import { html, LitElement } from '@polymer/lit-element';
import moment from 'moment';
import 'moment/locale/cs';
import 'moment/locale/de';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/nl';
import 'moment/locale/ru';
import { basic_weather_request, districts_details_api_call } from './api';
import { render__carousel } from './components/carousel';
import { render__location } from './components/location';
import style__carousel_card from './styles/carousel_card.css';
import style_glide_theme from './styles/glide-theme.css';
import style_glide_core from './styles/glide.css';
import main from './styles/main.css';
import style__placeholder_loading from './styles/placeholder-loading.css';
import style__towns from './styles/towns.css';
import style__typography from './styles/typography.css';
import { new_suedtirol_map } from './svg/new_map';
import { p } from './translations';
import { render__placehoder, placeholder_places, debounce } from './utils';

/** City id */
const localities_class = {
  7: 'dolomiten',
  6: 'bruneck',
  5: 'brixen',
  3: 'bozen',
  4: 'sterzing',
  2: 'meran',
  1: 'schlanders'
};

const WEATHER_ICON_PATH = 'https://www.suedtirol.info/static/img/weatherIcons';

class Meteo extends LitElement {
  constructor() {
    super();
    this.language_translation = 'en';
    this.weather_data = {};
    this.token = `iJ9gIQJ-LFaNT2m-R_dazqCf2XoXO8trlqZsgN6ENAMD9lrWsdKKxoOYkHdNQt9UAUJlMosEiF-njEUtoNwT3V6AtIt08bxrLa0DKLJYroj54I_C1kCPiWV69KR1IXUZj18av-nuofuYDzpE8jRYL02SI97jHEGWfnRLNOfLyEsp3pAp17rm-p6hst-t7Z0bYJkIqFvERMd4QHshaRvAb89EUPb_zEHj1JwgBUOwFIHf0e8Bm-1-nL8d9o9AIEGGDAIiJfvjGmNT-54vteKx1E_r7liUDuXfL0pctOpu5w5Mb_yBmnJsDGFjq7YHVL9dIqZzUvXnRXq1x4novqquK0jiEXRI3XxQN-qKuMpYQ8XqsXQWTjWqoGqgqbIGYpRXMcAUvO-6Y7SSKKvtMLvXGZjlC_IA0TMvF2r8JQbfluFk2XzKs7sqIu6OCxWT4Xxn8U2NWFtKXK4RkfXP9zOMP4FtTfz-X3kgwwgWuUnFvbufk9xRF8nNwqsxgwedNtnw0ouzarOI3zUFRg0dBKJse1z-_rGkF4QvTWwzGG17LPs`;
    this.base_url = `https://tourism.opendatahub.bz.it/api/Weather`;
    this.slider = {};
    this.is_loading = true;
    this.selected_district_id = 0;
    this.forecast_days = 5;

    // binded actions
    this.render__carousel = render__carousel.bind(this);
    this.basic_weather_request = basic_weather_request.bind(this);
    this.districts_details_api_call = districts_details_api_call.bind(this);
    this.render__location = render__location.bind(this);
  }

  // weather_data: { type: Object },
  // districts_details: { type: Array },
  static get properties() {
    return {
      language_translation: { type: String },
      is_loading: { type: Boolean },
      forecast_days: { type: Number },
      selected_district_id: { type: Number }
    };
  }

  async firstUpdated() {
    await this.districts_details_api_call();
    await this.basic_weather_request();
    await this.requestUpdate();

    const main_slider_element = this.shadowRoot.getElementById('main_slider');
    this.slider = new Glide(main_slider_element, {
      type: 'carousel',
      animationDuration: 300
    });

    let main_map_target = this.shadowRoot.getElementById('main_map');

    let map_bozen = this.shadowRoot.getElementById('bozen');
    let map_meran = this.shadowRoot.getElementById('meran');
    let map_schlanders = this.shadowRoot.getElementById('schlanders');
    let map_brixen = this.shadowRoot.getElementById('brixen');
    let map_sterzing = this.shadowRoot.getElementById('sterzing');
    let map_bruneck = this.shadowRoot.getElementById('bruneck');
    let map_dolomiten = this.shadowRoot.getElementById('dolomiten');

    let array_districts_getted_elements = [
      map_bozen,
      map_meran,
      map_schlanders,
      map_brixen,
      map_sterzing,
      map_bruneck,
      map_dolomiten
    ];

    let debounced_manage_map_events = debounce(function(event) {
      switch (event.type) {
        case 'mouseleave':
          if (event.path && event.path[0].id === 'main_map') {
            this.slider.go('=0');
          }
          if (event.explicitOriginalTarget && event.explicitOriginalTarget.firstElementChild.id === 'main_map') {
            this.slider.go('=0');
          }
          break;
        case 'mouseenter':
          let target = {};
          if (event.path) {
            target = event.path[0];
          }
          if (event.explicitOriginalTarget) {
            target = event.explicitOriginalTarget;
          }
          let district = parseInt(target.getAttribute('data-district_id'));
          target.classList.remove('weather-map-default');
          target.classList.add('weather-map-active');
          this.slider.go(`=${district}`);
          break;
        default:
          break;
      }
    }, 300).bind(this);

    this.slider.on(['run.after'], e => {
      const index = this.slider.index;
      array_districts_getted_elements.map(o => {
        o.classList.remove('weather-map-active');
        o.classList.add('weather-map-default');
      });
      if (index) {
        let target = array_districts_getted_elements[index - 1];
        target.classList.remove('weather-map-default');
        target.classList.add('weather-map-active');
      }
      this.selected_district_id = index;
    });

    main_map_target.onmouseleave = debounced_manage_map_events;

    array_districts_getted_elements.map(o => {
      o.onmouseenter = debounced_manage_map_events;
      o.onmouseleave = debounced_manage_map_events;
    });
    this.slider.mount();
    if (this.selected_district_id) {
      this.slider.go(`=${this.selected_district_id}`);
    }
  }

  render() {
    const { Stationdata, Forecast } = this.weather_data;

    /** The first six records are about today */
    let localities_today = Stationdata ? Stationdata.slice(0, 6) : [];
    let current_forecast = this.districts_details
      ? this.districts_details.filter(o => o.Id === this.selected_district_id)
      : [];
    const placeholder_mod = !localities_today.length;

    if (this.districts_details) {
      const { MaxTemp } = this.districts_details[6].BezirksForecast[0];

      localities_today = [
        ...localities_today,
        { ...this.districts_details[6].BezirksForecast[0], CityName: 'dolomiten', Id: 7, Maxtemp: MaxTemp }
      ];
    }

    return html`
      <style>
        ${style_glide_theme}
        ${style_glide_core}
        ${style__placeholder_loading}
        ${main}
        ${style__typography}
        ${style__towns}
        ${style__carousel_card}
      </style>
      <div class="meteo_widget">
        <h1>${p.weather_in_south_tyrol[this.language_translation]}</h1>
        <div class="meteo_widget__content">
          <div class="meteo_widget__map_container__responsive_manger">
            <div class="meteo_widget__map_container">
              ${new_suedtirol_map(this.language_translation)}
              ${placeholder_mod
                ? placeholder_places.map(({ Id, CityName, Maxtemp, MinTemp, WeatherCode }) => {
                    return this.render__location(
                      localities_class[Id],
                      CityName.split('/')[0],
                      Maxtemp,
                      MinTemp,
                      WeatherCode,
                      placeholder_mod
                    );
                  })
                : localities_today.map(({ Id, CityName, Maxtemp, MinTemp, WeatherCode }) => {
                    return this.render__location(
                      localities_class[Id],
                      CityName.split('/')[0],
                      Maxtemp,
                      MinTemp,
                      WeatherCode
                    );
                  })}
            </div>
          </div>
          ${this.render__carousel(localities_today)}
        </div>
        <div class="forecast">
          ${Forecast && this.selected_district_id === 0
            ? Forecast.slice(0, this.forecast_days).map(({ date, Weathercode, TempMinmin, TempMaxmax }) => {
                let weather_icon = `${WEATHER_ICON_PATH}/${Weathercode}.svg`;
                return html`
                  <div class="forecast__item">
                    <p class="forecast__item__day">${moment(date).format('dddd')}</p>
                    <img src=${weather_icon} class="forecast__item__icon" />
                    <p class="forecast__item__temp"><span>${TempMaxmax}</span> / ${TempMinmin}°C</p>
                  </div>
                `;
              })
            : [0, 1, 2, 3].slice(0, this.forecast_days).map(() => {
                if (this.selected_district_id === 0) {
                  return html`
                    <div class="forecast__item">
                      ${['forecast__date', 'forecast__icon', 'forecast__rain'].map(o => render__placehoder(o))}
                    </div>
                  `;
                }
              })}
          ${current_forecast.length && this.selected_district_id !== 0
            ? current_forecast.map(({ BezirksForecast }) => {
                let slice_of_bezirksforecast = BezirksForecast.slice(1, this.forecast_days + 1);
                return slice_of_bezirksforecast.map(
                  ({ date, WeatherCode, MinTemp, MaxTemp, RainFrom, RainTo, Part1, Part2, Part3, Part4 }) => {
                    // let rain_icon_path = rain_level_icons[render__rain_number(Part1, Part2, Part3, Part4)];
                    return html`
                      <div class="forecast__item">
                        <p class="forecast__item__day">${moment(date).format('dddd')}</p>
                        <img src="${WEATHER_ICON_PATH}/${WeatherCode}.svg" class="forecast__item__icon" />
                        <p class="forecast__item__temp"><span>${MaxTemp}</span> / ${MinTemp}°C</p>
                      </div>
                    `;
                  }
                );
              })
            : [0, 1, 2, 3].slice(0, this.forecast_days).map(() => {
                if (this.selected_district_id !== 0) {
                  return html`
                    <div class="forecast__item">
                      ${['forecast__date', 'forecast__icon', 'forecast__rain'].map(o => render__placehoder(o))}
                    </div>
                  `;
                }
              })}
        </div>
      </div>
    `;
  }
}

if (!window.customElements.get('meteo-widget')) {
  window.customElements.define('meteo-widget', Meteo);
}
