const dotenv = require("dotenv")
const cors = require('cors');
const bodyParser = require("body-parser"); 
dotenv.config()
const express = require("express")

const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const sessions = require("cookie-session")
const { apiV1 } = require("./src/routes/index")
const { connectDb } = require("./db")


const app = express()
app.use(cors())



app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

app.use(
  sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: true,
  })
)

app.get('/', function(req, res){
  console.log("Root Route")
  res.json({ message: "hello world" });
});


app.use("/v1", apiV1)

 
app.use((err, req, res, next) => {
  console.error("Error:", err)
  return res.status(500).json({ error: "Unknown server error" })
})

connectDb()
  .then(async () => {
   
  })
  .then(() => {
    app.listen(process.env.PORT || 8080, () => console.log("Server is listening on http://localhost:8080"))
    console.log("database connection established")
  })
  .catch((err) => {
    console.error("Failed to connect to database", err)
    process.exit(1)
  })