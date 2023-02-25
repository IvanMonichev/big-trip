import PointItemView from '../view/point-item-view';
import EditPointView from '../view/edit-point-view';
import { remove, render, replace } from '../framework/render';
import { isEscape } from '../utils/point-utils';
import { Mode } from '../constants/constants';


export default class PointPresenter {
  #mode = Mode.DEFAULT;
  #changeMode = null;
  #pointComponent = null;
  #destinations = null;
  #offersBtType = null;
  #editPointComponent = null;
  #container = null;
  #updateData = null;
  #point = null;

  constructor(container, updateData, changeMode) {
    this.#container = container;
    this.#updateData = updateData;
    this.#changeMode = changeMode;
  }

  init = (point, destinations, offersBtType) => {
    this.#point = point;
    this.#destinations = destinations;
    this.#offersBtType = offersBtType;

    const prevPontComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    // Создаём экземпляры компонентов
    this.#pointComponent = new PointItemView(point, destinations, offersBtType);
    this.#editPointComponent = new EditPointView(point, destinations, offersBtType);

    // Вешаем слушатели через колбэк
    this.#pointComponent.setButtonClickHandler(this.#editButtonClickHandler);
    this.#pointComponent.setFavoriteBtnClickHandler(this.#favoriteBtnClickHandler)
    this.#editPointComponent.setButtonClickHandler(this.#closeButtonClickHandler);
    this.#editPointComponent.setFormSubmitHandler(this.#formSubmitHandler);

    // Проверка на отсутствие элементов
    if (prevPontComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    // Проверка на наличие в DOM для оптимизации
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPontComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPontComponent);
    remove(prevEditPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #editButtonClickHandler = () => {
    this.#replacePointToForm();
  };

  #closeButtonClickHandler = () => {
    this.#editPointComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #formSubmitHandler = (point, destinations, offersByType) => {
    this.#updateData(point, destinations, offersByType);
    this.#replaceFormToPoint();
  };

  #favoriteBtnClickHandler = () => {
    console.log({ ...this.#point, isFavorite: !this.#point.isFavorite});
    this.#updateData({ ...this.#point, isFavorite: !this.#point.isFavorite}, this.#destinations, this.#offersBtType);
  }

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt) || evt.key === 'ArrowUp') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };
}
