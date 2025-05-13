const { connectToDatabase, getObjectId } = require('../config/db');

class BookingModel {
  static async getCollection() {
    const db = await connectToDatabase();
    return db.collection('carSwapBookings');
  }

  static async createBooking(bookingData) {
    const collection = await this.getCollection();
    bookingData.status = 'confirmed'; // confirmed, cancelled, completed
    bookingData.createdAt = new Date();
    const result = await collection.insertOne(bookingData);
    return { ...bookingData, _id: result.insertedId };
  }

  static async getBookingDetails(bookingId) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: getObjectId(bookingId) });
  }

  static async cancelBooking(bookingId, cancellationReason) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: getObjectId(bookingId) },
      { $set: { status: 'cancelled', cancellationReason, cancelledAt: new Date() } }
    );
  }

  static async getUserBookings(userId) {
    const collection = await this.getCollection();
    return collection.find({
      $or: [
        { renterId: getObjectId(userId) },
        { ownerId: getObjectId(userId) }
      ]
    }).sort({ createdAt: -1 }).toArray();
  }

  static async getCarBookings(carId) {
    const collection = await this.getCollection();
    return collection.find({ carId: getObjectId(carId) }).sort({ startDate: 1 }).toArray();
  }

  static async markBookingComplete(bookingId, finalMileage, conditionNotes) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: getObjectId(bookingId) },
      { 
        $set: { 
          status: 'completed',
          finalMileage,
          conditionNotes,
          completedAt: new Date() 
        } 
      }
    );
  }
}

module.exports = BookingModel;