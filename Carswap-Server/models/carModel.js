const { connectToDatabase, getObjectId } = require("../config/db");

class CarModel {
  static async getCollection() {
    const db = await connectToDatabase();
    return db.collection("cars");
  }

  static async createCarPost(carData) {
    const collection = await this.getCollection();
    const result = await collection.insertOne(carData);
    return { ...carData, _id: result.insertedId };
  }

  static async getAllCarPosts(filter = { status: "pending" }) {
    const collection = await this.getCollection();
    return collection.find(filter).toArray();
  }

  static async getCarPostById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: getObjectId(id) });
  }

  static async updateCarPost(id, updateData) {
    const collection = await this.getCollection();
    return collection.updateOne({ _id: getObjectId(id) }, { $set: updateData });
  }

  static async deleteCarPost(id) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: getObjectId(id) });
  }

  static async getCarsByOwner(ownerId) {
    const collection = await this.getCollection();
    return collection.find({ ownerId }).toArray();
  }

  static async approveCarPost(id) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: getObjectId(id) },
      { $set: { status: "approved" } }
    );
  }

  static async verifyCarLicense(id, licenseVerified) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: getObjectId(id) },
      { $set: { licenseVerified } }
    );
  }

  static async placeBid(carId, bidData) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: getObjectId(carId) },
      { $push: { bids: bidData } }
    );
  }

  static async getBidsForCar(carId) {
    const collection = await this.getCollection();
    const car = await collection.findOne(
      { _id: getObjectId(carId) },
      { projection: { bids: 1 } }
    );
    return car?.bids || [];
  }

  static async acceptBid(bidId) {
    // Implementation depends on your bid structure
    // This is a placeholder implementation
    const collection = await this.getCollection();
    return collection.updateOne(
      { "bids._id": getObjectId(bidId) },
      { $set: { "bids.$.status": "accepted" } }
    );
  }
}

module.exports = CarModel;
