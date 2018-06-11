import jwt from "jsonwebtoken";

//Verify JWT Middleware
let checkToken = (req, res, next) => {
  //retrieve token from headers
  let storedToken = req.headers.token;
  console.log("Headers content : ", req.headers);
  console.log("storedToken: ", storedToken);
  //Syntax correct with a token
  if (!storedToken) {
    return res.status(403).send({
      auth: false,
      message: "No token provided."
    });
  } else {
    return jwt.verify(storedToken, "mysecret", function(err, decoded) {
      if (err) {
        res.status(401).send("Token not valid");
        // res.status(401).json({sucess: false, auth: 'The token is not valid'})
        throw err;
      } else {
        console.log("You can access the route with userID :", decoded);
        res.locals.user = decoded;
        console.log(
          "checkToken Middleware req.connectedProfile: ",
          res.locals.user
        );
        next();
        // console.log('Decoded token avec id: ',decoded);
      }
    });
  }
};

export {
  checkToken
  //rajouter le nom des autres variables avec les fonctions
};
