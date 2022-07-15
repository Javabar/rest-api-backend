const { Router } = require("express"); 
const {signUp, login, updateUser, deleteUser, getUsers} = require("./controllers"); 
const { hashPass, comparePass, tokenCheck } = require("../middleware");
const userRouter = Router(); 

userRouter.post("/user", hashPass, signUp); 
userRouter.post("/login", comparePass, login); 
userRouter.get("/user", tokenCheck, login); 
userRouter.patch("/user", hashPass, updateUser);
userRouter.delete("/user", tokenCheck, deleteUser);
userRouter.get("/users", getUsers); 
module.exports = userRouter;