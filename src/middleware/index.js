const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../user/model");

exports.hashPass = async (req, res, next) => {
  try {
    // const tempPass = req.body.password; //grabbed password variable from body, and stored it locally
    // const hashedPass = await bcrypt.hash(tempPass, 8); //hashed the password and stored it in a new constant
    // req.body.password = hashedPass; //stores freshly hashed password back in the req body
    if (req.body.password) {
      //all steps above, condensed into 1 line
        req.body.password = await bcrypt.hash(req.body.password, 8); 
    } else if (req.body.updateObj.password) {
      req.body.updateObj.password = await bcrypt.hash(
        req.body.updateObj.password,
        8
      );
    }
//moves onto next middleware/controller in endpoint
    next(); 
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

exports.comparePass = async (req, res, next) => {
  try {
    req.user = await User.findOne({ username: req.body.username });

    if (await bcrypt.compare(req.body.password, req.user.password)) {
      next();
    } else {
      throw new Error("Incorrect credentials");
    }
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

exports.tokenCheck = async (req, res, next) => {
  try {
    // const token = req.header("Authorization"); //grab token from Authorization header in the request
    //decode token using same secret that created the token
    const decodedToken = jwt.verify(
      req.header("Authorization"),
      process.env.SECRET
    ); 
    //finding the user by their id, stored in the token
    req.user = await User.findById(decodedToken.id); 
    next();
  } catch (error) {
    console.log(error);
    res.send({ error });
  };
};