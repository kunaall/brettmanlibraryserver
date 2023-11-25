const router = require("express")()
const { BookModel } = require("../models/book")
const { UserModel } = require("../models/user")

const omitPassword = (user) => {
  
  const { username,role,_id  } = user[0]
  return { username,role,_id}
}
const omitPasswordd = (user) => {
  
  const { username,role,_id  } = user
  return { username,role ,_id }
}

router.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find({})
    return res.status(200).json({ users: users.map((user) => omitPassword(user.toJSON())) })
  } catch (err) {
    next(err)
  }
})

router.post("/borrow", async (req, res, next) => {
  try {console.log("dfdf");
    const book = await BookModel.findOne({ isbn: req.body.isbn })
    if (book == null) {
      return res.status(404).json({ error: "Book not found" })
    }
    if (book.borrowedBy.length === book.quantity) {
      return res.status(400).json({ error: "Book is not available" })
    }
    const user = await UserModel.findById(req.body.userId)
  
   
    if (user == null) {
      return res.status(404).json({ error: "User not found" })
    }
    if (book.borrowedBy.includes(user._id.toString())) {
      return res.status(400).json({ error: "You've already borrowed this book" })
    }
    await book.updateOne({ borrowedBy: [...book.borrowedBy, (user._id).toString()] })
    const updatedBook = await BookModel.findById(book._id)
    
    return res.status(200).json({
      book: {
        ...updatedBook.toJSON(),
        availableQuantity: updatedBook.quantity - updatedBook.borrowedBy.length,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.post("/return", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.body.isbn })
    if (book == null) {
      return res.status(404).json({ error: "Book not found" })
    }
    const user = await UserModel.findById(req.body.userId)
    if (user == null) {
      return res.status(404).json({ error: "User not found" })
    }
    if (!book.borrowedBy.includes((user._id).toString())) {
      return res.status(400).json({ error: "You need to borrow this book first!" })
    }
    
 
  const idstring= (user._id).toString()
  const filteredborrwedby=book.borrowedBy.filter(ob => ob!=idstring)
  

    await book.updateOne({
      borrowedBy: filteredborrwedby}).
      catch((err) => console.log(err))
    
    const updatedBook = await BookModel.findById(book._id)
  
    return res.status(200).json({
      book: {
        ...updatedBook.toJSON(),
        availableQuantity: updatedBook.quantity - updatedBook.borrowedBy.length,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.post("/borrowed-books", async (req, res, next) => {
  try {
  
    const usser = await UserModel.find({username:req.body.username});
   
    const userid=(usser[0]._id).toString();
    const result = await BookModel.find({ "borrowedBy": { "$in": userid} })
    return res.status(200).json({ books: result })
  } catch (err) {
    next(err)
  }
})

router.post("/profile", async (req, res, next) => {
  try {
  
    const user = await UserModel.find({username:req.body.username})
    
    if (user == null) {
      return res.status(404).json({ error: "User not found" })
    }
    
    return res.status(200).json({ user: omitPassword(user) })
  } catch (err) {
    next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username })
    
    if (user == null) {
      return res.status(404).json({ error: "User not found" })
    }
    if (user.password !== req.body.password) {
      return res.status(400).json({ error: "Invalid password" })
    }
   
   
    
    return res.status(200).json({ user: omitPasswordd(user.toJSON()) })
  } catch (err) {
    next(err)
  }
})

router.post("/register", async (req, res, next) => {
  let userrole="guest";
  if (req.body.checked){userrole="admin"}
  try {
    const doc = new UserModel({ username: req.body.username ,password: req.body.password,role: userrole });
    await doc.save();
  } catch (err) {
    next(err)
  }
  try {
    const user = await UserModel.findOne({ username: req.body.username })
    
    if (user == null) {
      return res.status(404).json({ error: "User not found" })
    }
   
   
   
    
    return res.status(200).json({ user: omitPasswordd(user.toJSON()) })
  } catch (err) {
    next(err)
  }

})



module.exports = { router }