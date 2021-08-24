import '../css/style.css';
import './plugins';
import locations from './store/locations';
import formUI from './views/form';
import ticketsUI from './views/tickets';
import currencyUI from './views/currency';
import favorites from './store/favorites';

document.addEventListener('DOMContentLoaded', e => {
  const form = formUI.form;
  const ticketsList = document.querySelector('.tickets-sections');
  const favoritesList = document.getElementById('dropdown1');
  // Events
  initApp();
  favorites.init();
  form.addEventListener('submit', e => {
    e.preventDefault();
    onFormSubmit();
  });
  ticketsList.addEventListener('click', e => {
    e.preventDefault();
    favorites.onAddHandler(e);
  })
  favoritesList.addEventListener('click', e => {
    favorites.onDeleteHandler(e);
  })


  // handlers
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCities);
  }

  async function onFormSubmit() {
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currecyValue;

    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });

    ticketsUI.renderTickets(locations.lastSearch);
  }
});

// *1 - создать отдельный метод для получения airlines
// *2 - в init добавить получение airlines
// *3 - serializeAirlines
// *4 - serializeTickets и переделать serializeCities и createShortCities и getCityCodeByKey
// *5 - новые методы getAirlineNameByCode, getAirlineLogoByCode, getCityNameByCode
// *6 - TicketsUI
