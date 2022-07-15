const express = require("express");
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const userRoute = require("./Routes/User/User.js");
const authRoute = require("./Routes/Auth/Auth.js");
const ProductRoute = require("./Routes/Product/Product.js");
const CartRoute = require("./Routes/Cart/Cart.js");
const OrderRoute = require("./Routes/Order/Order.js");
const stripeRoute = require("./Routes/Stripe/Stripe.js")
const cors = require("cors"); 


dotenv.config();

const App = express();
mongoose.connect(
  process.env.MONGO_KEY
).then(
  () => { console.log("connected") }
).catch(
  (err) => { console.log(err); }
);


App.use(cors());
// cors({
//   credentials: true,
//   preflightContinue: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH' , 'DELETE', 'OPTIONS'],
//   origin: true
// })
App.use(express.json());

App.use("/api/user", userRoute);
App.use("/api/auth", authRoute);
App.use("/api/product", ProductRoute);
App.use("/api/cart", CartRoute);
App.use("/api/order", OrderRoute);
App.use("/api/checkout", stripeRoute);


App.listen(process.env.PORT || 5000, () => {
  console.log("BACKEND IS ON")
})