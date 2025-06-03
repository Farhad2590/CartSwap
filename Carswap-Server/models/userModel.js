const { connectToDatabase, getObjectId } = require("../config/db");

class UserModel {
  static async getCollection() {
    const db = await connectToDatabase();
    return db.collection("carSwapUser");
  }

  static async getAllUsers() {
    const collection = await this.getCollection();
    return collection.find().toArray();
  }

  static async getUserByEmail(email) {
    const collection = await this.getCollection();
    return collection.findOne({ email });
  }

  static async getUserById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: getObjectId(id) });
  }

  static async createUser(user) {
    const collection = await this.getCollection();
    return collection.insertOne(user);
  }

  static async deleteUser(id) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: getObjectId(id) });
  }

  static async updateUserRole(email, role) {
    const collection = await this.getCollection();
    return collection.updateOne({ email }, { $set: { role } });
  }

  static async checkAdminStatus(email) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email });
    return { admin: user?.userType === "admin" };
  }

  static async checkOwnerStatus(email) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email });
    return { owner: user?.userType === "owner" };
  }

  static async checkRenterStatus(email) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email });
    return { renter: user?.userType === "renter" };
  }

  static async updateUserByEmail(email, updateData) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { email },
      { $set: updateData },
      { upsert: true }
    );
  }


static async getUserStats() {
  try {
    const collection = await this.getCollection();
    
    const stats = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalRenters: {
            $sum: {
              $cond: [
                { $eq: ["$userType", "renter"] },
                1,
                0
              ]
            }
          },
          totalOwners: {
            $sum: {
              $cond: [
                { $eq: ["$userType", "owner"] },
                1,
                0
              ]
            }
          },
          verifiedHolders: {
            $sum: {
              $cond: [
                { $eq: ["$verificationStatus", "verified"] },
                1,
                0
              ]
            }
          }
        }
      }
    ]).toArray();
    
    return stats.length > 0 ? stats[0] : {
      totalRenters: 0,
      totalOwners: 0,
      verifiedHolders: 0
    };
  } catch (error) {
    console.error("Error in getUserStats model:", error);
    throw error;
  }
}
  
}

module.exports = UserModel;
