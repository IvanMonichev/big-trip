import { formatDate } from '../utils/point-utils';
import AbstractView from '../framework/view/abstract-view';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const createOffersTemplate = (offers, type, offersByType) => {
  const offersByCurrentType = offersByType.find((item) => item.type === type).offers;
  const offersById = offersByCurrentType.filter((item) => offers.includes(item.id));

  return offersById.map(({ title, price }) => (
    `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`
  )).join('');
};

const createPointItemTemplate = (points, destinations, offersByType) => {
  const { dateFrom, dateTo, basePrice, type, isFavorite, destination, offers } = points;

  const isFavoriteItem = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  return (
    `<li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${formatDate(dateFrom, 'YYYY-MM-DD')}">${formatDate(dateFrom, 'MMM DD')}</time>
            <div class="event__type">
              <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
            </div>
            <h3 class="event__title">${destination.name}</h3>
            <div class="event__schedule">
              <p class="event__time">
                <time class="event__start-time" datetime="${formatDate(dateFrom, 'YYYY-MM-DDTHH:mm')}">${formatDate(dateFrom, 'H:mm')}</time>
                &mdash;
                <time class="event__end-time" datetime="${formatDate(dateTo, 'YYYY-MM-DDTHH:mm')}">${formatDate(dateTo, 'H:mm')}</time>
              </p>
              <p class="event__duration">30M</p>
            </div>
            <p class="event__price">
              &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
            </p>
            <h4 class="visually-hidden">Offers:</h4>
            <ul class="event__selected-offers">
              ${createOffersTemplate(offers, type, offersByType)}
            </ul>
            <button class="event__favorite-btn ${isFavoriteItem}" type="button">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
            </button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
        </div>
    </li>`
  );
};

export default class PointItemView extends AbstractStatefulView {
  constructor(point, destinations, offersByType) {
    super();
    this._state = point;
    this.destinations = destinations;
    this.offersByType = offersByType;
  }

  get template() {
    return createPointItemTemplate(this._state, this.destinations, this.offersByType);
  }

  static parsePointToState = (point) => ({ ...point});

  setButtonClickHandler = (callback) => {
    this._callback.clickClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonClickHandler);
  };

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickClose();
  };

  setFavoriteBtnClickHandler = (callback) => {
    this._callback.clickFavorite = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteBtnClickHandler);
  };

  #favoriteBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickFavorite(PointItemView.parsePointToState(this._state));
  };
}
