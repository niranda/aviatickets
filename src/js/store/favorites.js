import locations from "./locations";
import currencyUI from "../views/currency";

class Favorites {
  constructor(currency) {
    this.favoriteList = {};
    this.getCurrencySymbol = currency.getCurrencySymbol.bind(currency);
    this.isFavoriteInList = false;
  }

  init() {
    const favoritesList = document.getElementById("dropdown1");
    const children = Array.from(favoritesList.children);
    if (!children.length) {
      const h5 = document.createElement("h5");
      h5.classList.add("favoriteText", "center-align");
      h5.textContent = "It looks like there are no favorites";
      favoritesList.appendChild(h5);
    } else {
      const h5 = document.querySelector(".favoriteText");
      if (!h5) return;
      favoritesList.removeChild(h5);
    }
  }

  onAddHandler({ target }) {
    if (!target.classList.contains("add-favorite")) return;
    const parent = target.closest(".ticket-card");
    const idKey = parent.dataset.id;
    const idTickets = this.getNewIdTickets(locations.lastSearch);
    idTickets[idKey].favorite = true;
    const departureAt = idTickets[idKey].departure_at;
    Object.values(this.favoriteList).forEach((elem) => {
      if (departureAt === elem.departure_at) {
        throw new Error("The card is already in your list");
      }
    });
    this.favoriteList[idKey] = idTickets[idKey];
    this.addFavTicket(idTickets[idKey], this.currency);
    this.init();
    console.log(this.favoriteList);
  }

  onDeleteHandler({ target }) {
    if (!target.classList.contains("delete-favorite")) return;
    const parent = target.closest(".favorite-item");
    const idKey = parent.dataset.id;
    const objIdTickets = this.getNewIdTickets(locations.lastSearch);
    delete this.favoriteList[idKey];
    if (!objIdTickets.hasOwnProperty(idKey)) {
      this.deleteFavTicket(parent);
    } else {
      this.deleteFavTicket(parent, objIdTickets[idKey]);
    }
    this.init();
    console.log(this.favoriteList);
    console.log(objIdTickets);
  }

  getNewIdTickets(ticketsList) {
    return this.getId(ticketsList);
  }

  getId(ticketList) {
    return Object.entries(ticketList).reduce((acc, [, item]) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }

  addFavTicket(ticket) {
    const currency = this.getCurrencySymbol();
    const container = document.querySelector(".dropdown-content");
    const elem = Favorites.smallTicketTemplate(ticket, currency);
    container.insertAdjacentHTML("afterbegin", elem);
  }

  deleteFavTicket(ticketHTML, ticket = null) {
    const container = document.getElementById("dropdown1");
    container.removeChild(ticketHTML);
    if (!ticket) return;
    ticket.favorite = false;
  }

  static smallTicketTemplate(ticket, currency) {
    return `
    <div class="favorite-item  d-flex align-items-start" data-id="${ticket.id}">
                <img
                  src="${ticket.airline_logo}"
                  class="favorite-item-airline-img"
                />
                <div class="favorite-item-info d-flex flex-column">
                  <div
                    class="favorite-item-destination d-flex align-items-center"
                  >
                    <div class="d-flex align-items-center mr-auto">
                      <span class="favorite-item-city">${ticket.origin_name}</span>
                      <i class="medium material-icons">flight_takeoff</i>
                    </div>
                    <div class="d-flex align-items-center">
                      <i class="medium material-icons">flight_land</i>
                      <span class="favorite-item-city">${ticket.destination_name}</span>
                    </div>
                  </div>
                  <div class="ticket-time-price d-flex align-items-center">
                    <span class="ticket-time-departure">${ticket.departure_at}</span>
                    <span class="ticket-price ml-auto">${currency}${ticket.price}</span>
                  </div>
                  <div class="ticket-additional-info">
                    <span class="ticket-transfers">Пересадок: ${ticket.transfers}</span>
                    <span class="ticket-flight-number">Номер рейса: ${ticket.flight_number}</span>
                  </div>
                  <a
                    class="waves-effect waves-light btn-small pink darken-3 delete-favorite ml-auto"
                    >Delete</a
                  >
                </div>
              </div>
    `;
  }
}

const favorites = new Favorites(currencyUI);

export default favorites;
