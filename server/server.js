// const express = require('express');
// const colors = require('colors');
// const morgan = require('morgan');
// const dotenv = require('dotenv');
// const { connectDB } = require('./config/db');
// const cors = require('cors');

// //dotenv config
// dotenv.config();

// // connect to database
// connectDB();

// // rest object
// const app = express();
// app.use(cors());
// //middlevares
// app.use(morgan('dev'));
// app.use(express.json());

// //routes
// app.use("/user", require("./routes/userRoutes"));
// app.use("/pet", require("./routes/petRoute"));


// app.get('/', (req, res) => {
//   res.status(200).send({
//     message: "server is running"
//   });
// });
// // port
// const port = process.env.PORT || 8080;
// // listen port
// app.listen(port, () => {
//   console.log(`Server is running in ${process.env.NODE_MODE} mode on port ${process.env.PORT}`.yellow.bold);
// });

// // Serve frontend
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(
//       path.resolve(__dirname, "../", "client", "build", "index.html")
//     )
//   );
// } else {
//   app.get("/", (req, res) => res.send("Please set to production"));
// }
const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const cors = require('cors');

// dotenv config
dotenv.config();

// Connect to database
connectDB();

// Rest object
const app = express();
app.use(cors());

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use("/user", require("./routes/userRoute"));
app.use("/pet", require("./routes/petRoute"));
app.use("/admin", require("./routes/adminroute"));

// Health check route
app.get('/', (req, res) => {
  res.status(200).send({
    message: "Server is running"
  });
});

// Port
const port = process.env.PORT || 8080;

// Listen port
app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_MODE} mode on port ${port}`.yellow.bold);
});

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}
