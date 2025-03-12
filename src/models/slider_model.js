const mongoose = require("mongoose");
const { Schema } = mongoose;
const ConnectionDocument = "sliders";
const ModelDocument = "Slider";
const productSchema = new Schema(
  {
    name: { type: String, 
      required: [true, "Name is not empty"],
      unique: [true, "Name must be unique"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [100, "Name must be at most 100 characters"],
     },
    status: { type: String, 
      enum: {
        values: ["active", "inactive"],
        messages:"Status is active or inactive"
      }, default: "inactive" },
    ordering: { type: Number, min: [0, "Ordering must be bigger or equal than 0"], max: [100, "Ordering must be smaller or equal than 100"] },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    imageUrl: { type: String, validate:{
      validator: function(v){
        return /^(http|https):\/\/[^ "]+$/.test(v);
      }, message: "ImageUrl must be a valid URL"
    } },
  },
  { collection: ConnectionDocument, timestamps: true }
);
module.exports = mongoose.model(ModelDocument, productSchema);