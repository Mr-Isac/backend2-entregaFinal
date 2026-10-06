import Ticket from "../models/Ticket.js";

class TicketsDAO {

  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async getByCode(code) {
    return await Ticket.findOne({
      code
    });
  }

}

export default TicketsDAO;