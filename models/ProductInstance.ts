import { Schema, model, models } from "mongoose";

const ProductInstanceSchema = new Schema({
  projectId: { type: String, required: true }, 
  nameSpace: { type: String, required: true },  
  name: String,
  productType: String,
  integrations: {
    shopify: { type: Boolean, default: false },
    crm: { type: Boolean, default: false },
  },
});

const ProductInstance =
  models.ProductInstance || model("ProductInstance", ProductInstanceSchema);

export default ProductInstance;