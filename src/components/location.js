import { html } from '@polymer/lit-element';
import { render__placehoder } from '../utils';

export function render__location(location, name, max_temp, min_temp, weather_code, placeholder_mod) {
  let class__weather__icon = `weather-map-new__icon weather-map-new__icon--${location}`;
  return html`
    <a class="weather-map-new__info" href="#">
      ${placeholder_mod
        ? html`
            <div class="${class__weather__icon}">
              ${render__placehoder('loader__placeholder__super_small map__icon')}
            </div>
          `
        : html`
            <img
              src="https://www.suedtirol.info/static/img/weatherIcons/${weather_code}.svg"
              class="${class__weather__icon}"
            />
          `}
      <div class="weather-map-new__temp weather-map-new__temp--${location}">
        <div class="temp-color-max">
          ${placeholder_mod ? render__placehoder('loader__placeholder__super_small map__temp') : max_temp + '°'}
        </div>
        <div class="temp-color-min">${placeholder_mod ? null : min_temp + '°'}</div>
      </div>
      <div class="weather-map-new__town weather-map-new__town--${location}">
        ${placeholder_mod ? render__placehoder('map__town') : name}
      </div>
    </a>
  `;
}
