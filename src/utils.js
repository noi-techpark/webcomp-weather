import { html } from '@polymer/lit-element';

export const placeholder_places = [
  {
    Id: 1,
    CityName: 'Silandro',
    WeatherCode: 'a',
    MinTemp: -7,
    Maxtemp: 2
  },
  {
    Id: 2,
    CityName: 'Merano',
    WeatherCode: 'b',
    MinTemp: -6,
    Maxtemp: 5
  },
  {
    Id: 3,
    CityName: 'Bolzano',
    WeatherCode: 'b',
    MinTemp: -5,
    Maxtemp: 5
  },
  {
    Id: 4,
    CityName: 'Vipiteno',
    WeatherCode: 'a',
    MinTemp: -13,
    Maxtemp: -1
  },
  {
    Id: 5,
    CityName: 'Bressanone',
    WeatherCode: 'b',
    MinTemp: -7,
    Maxtemp: 3
  },
  {
    Id: 6,
    CityName: 'Brunico',
    WeatherCode: 'b',
    MinTemp: -15,
    Maxtemp: -1
  },
  {
    Id: 7,
    CityName: 'Dolomiten',
    WeatherCode: 'b',
    MinTemp: -15,
    Maxtemp: -1
  }
];
export function render__placehoder(custom_class) {
  return html`
    <div class="loader__placeholder ${custom_class}"><div class="line"></div></div>
  `;
}

export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export const city_district_assoc = {
  1: 3,
  2: 2,
  3: 1,
  4: 5,
  5: 4,
  6: 6
};

export const district_city_assoc = {
  1: 3,
  2: 2,
  3: 1,
  4: 5,
  5: 4,
  6: 6
};
