const { connectToDatabase, getObjectId } = require("../config/db");

class PaymentModel {
  static async getCollection() {
    const db = await connectToDatabase();
    return db.collection("carSwapPayments");
  }

  static async createPayment(paymentData) {
    const collection = await this.getCollection();
    paymentData.createdAt = new Date().toISOString();
    paymentData.updatedAt = new Date().toISOString();
    const result = await collection.insertOne(paymentData);
    return { ...paymentData, _id: result.insertedId };
  }

  static async getPaymentById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: getObjectId(id) });
  }

  static async getPaymentsByUser(email) {
    const collection = await this.getCollection();
    return collection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async updatePaymentStatus(id, status, transactionId = null) {
    const collection = await this.getCollection();
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    return collection.updateOne({ _id: getObjectId(id) }, { $set: updateData });
  }

  static async updatePaymentStatusByTransactionId(
    transactionId,
    status,
    valId = null
  ) {
    const collection = await this.getCollection();
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (valId) {
      updateData.valId = valId;
    }

    return collection.updateOne({ transactionId }, { $set: updateData });
  }
}

module.exports = PaymentModel;
