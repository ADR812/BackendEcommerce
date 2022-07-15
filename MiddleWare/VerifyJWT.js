const Jwt = require("jsonwebtoken");

const VerifyJWT = (req,res,next)=>{
  const authToken = req.headers.token;
  if(authToken){
    const token = authToken.split(" ")[1];
    Jwt.verify(token,process.env.JWT_SECRET_KEY,(err,dat)=>{
      if(err) res.status(403).json("Token not valid");
      req.user = dat;
      next();
    })
  }
  else{
    return res.status(401).json("you are not authenticated");
  }
}

const verifyTokenAuth = (req,res,next)=>{
  VerifyJWT(req,res,()=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
      next();
    }
    else{
      res.status(403).json("invalid action")
    }
  })
}

const verifyTokenAdmin = (req,res,next)=>{
  VerifyJWT(req,res,()=>{
    if(req.user.isAdmin){
      next();
    }
    else{
      res.status(403).json("admin access denied")
    }
  })
}

module.exports = {VerifyJWT,verifyTokenAuth,verifyTokenAdmin};