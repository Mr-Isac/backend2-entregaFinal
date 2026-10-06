import crypto from "crypto";
import TicketsRepository from "../repositories/tickets.repository.js";

class TicketsService {

  constructor() {
    this.repository = new TicketsRepository();
  }

  async create(amount, purchaser) {

    const code = crypto
      .randomBytes(16)
      .toString("hex");

    return await this.repository.create({
      code,
      amount,
      purchaser
    });
  }

}

export default TicketsService;