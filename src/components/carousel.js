import { html } from '@polymer/lit-element';
import moment from 'moment';
import { p } from '../translations';
import { render__placehoder, district_city_assoc, debounce } from '../utils';
import Glide from '@glidejs/glide';

function render__carousel__card(header_img_src, location, today, today_string, language) {
  return html`
    <li class="glide__slide">
      <div class="carousel__card">
        <div class="carousel__card__header_img" style="background-image: url('${header_img_src}');"></div>
        <div class="carousel__card__body">
          ${today && today.WeatherCode
            ? html`
                <div class="carousel__card__body__weather_icon">
                  <img
                    style=""
                    src=${`https://www.suedtirol.info/static/img/weatherIcons/${today ? today.WeatherCode : ''}.svg`}
                  />
                </div>
              `
            : null}
          <div
            class="carousel__card__body__text_container"
            style="${today && !today.WeatherCode ? 'margin-left: 8px;' : ''}"
          >
            <div class="carousel__card__body__v_align_middle">
              <p class="carousel__card__body__location">${location}</p>
              ${today && today.temp_string
                ? html`
                    <p>${today.temp_string}</p>
                  `
                : ''}
              ${today && `${today.MaxTemp}` && !today.temp_string
                ? html`
                    <div class="temp-color-max"><span>${today.MaxTemp}</span>°C</div>
                  `
                : null}
              ${today && `${today.MinTemp}` && !today.temp_string
                ? html`
                    <div class="temp-color-min">${' '}/ ${today.MinTemp}°C</div>
                  `
                : null}
            </div>
          </div>
          <div class="carousel__card__body__date">
            <p>
              ${today_string},
              ${today
                ? moment(today.date).format(language === 'de' ? 'dddd DD.MM.YYYY' : 'dddd DD/MM/YYYY')
                : // .toLocaleLowerCase()
                  ''}
            </p>
          </div>
        </div>
      </div>
    </li>
  `;
}

export function render__carousel(localities_today) {
  if (!this.districts_details || !this.weather_data || !localities_today.length) {
    return render__placehoder('map__slider');
  }

  moment.locale(this.language_translation);
  let today_string = p.today[this.language_translation];
  let bolzano_for_suedtirol = this.districts_details[0];

  let placeholder_image =
    'https://img-aws.ehowcdn.com/877x500p/s3-us-west-1.amazonaws.com/contentlab.studiod/getty/f24b4a7bf9f24d1ba5f899339e6949f3';

  return html`
    <div id="district_slider">
      <div id="main_slider" class="glide">
        <div class="glide__track" data-glide-el="track">
          <ul class="glide__slides">
            ${bolzano_for_suedtirol
              ? render__carousel__card(
                  placeholder_image,
                  'Südtirol',
                  bolzano_for_suedtirol.BezirksForecast[0],
                  today_string,
                  this.language_translation
                )
              : null}
            ${this.districts_details.map(o => {
              const { BezirksForecast } = o;

              const city = localities_today.filter(c => c.Id === district_city_assoc[o.Id]);
              let city_name = '';
              if (city.length) {
                city_name = city[0].CityName.split('/')[0];
              } else {
                city_name = p.dolomiti[this.language_translation];
              }

              return html`
                ${render__carousel__card(placeholder_image, city_name, BezirksForecast[0], today_string)}
              `;
            })}
          </ul>
        </div>
        <div class="glide__arrows" data-glide-el="controls">
          <button class="glide__arrow glide__arrow--left" data-glide-dir="<">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 501.5 501.5">
              <g>
                <path
                  fill="#2E435A"
                  d="M302.67 90.877l55.77 55.508L254.575 250.75 358.44 355.116l-55.77 55.506L143.56 250.75z"
                />
              </g>
            </svg>
          </button>
          <button class="glide__arrow glide__arrow--right" data-glide-dir=">">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 501.5 501.5">
              <g>
                <path
                  fill="#2E435A"
                  d="M199.33 410.622l-55.77-55.508L247.425 250.75 143.56 146.384l55.77-55.507L358.44 250.75z"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

// <div class="glide__bullets" data-glide-el="controls[nav]">
//   <button class="glide__bullet" data-glide-dir="=0"></button> ${this.districts_details.map((o, i) => {
//     return html`
//       <button class="glide__bullet" data-glide-dir="=${i + 1}"></button>
//     `;
//   })}
// </div>
