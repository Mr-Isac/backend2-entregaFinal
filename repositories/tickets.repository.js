import TicketsDAO from "../dao/tickets.dao.js";

class TicketsRepository {

  constructor() {
    this.dao = new TicketsDAO();
  }

  async create(ticketData) {
    return await this.dao.create(ticketData);
  }

  async getByCode(code) {
    return await this.dao.getByCode(code);
  }

}

export default TicketsRepository;