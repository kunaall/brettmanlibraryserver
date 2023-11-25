const { model, Schema } = require("mongoose")

const UserModel = model(
  "libusers",
  new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true ,default: "guest" },
  })
)

module.exports = { UserModel }