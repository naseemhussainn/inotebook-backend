const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sceretKeyUsedforAuthencticationInotebook'
const fetchuser = async (req,res,next) =>{
    //geting usre data from user id in header
    var authToken = req.header('auth-token');
    if(!authToken){
        res.status(401).json({error:'please authenticate using valid token'})
    }
    try {
        var data = jwt.verify(authToken, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        error = {
            msg : "please authenticate with valid token"
        }
        res.status(401).json(error)
    }

}

module.exports = fetchuser;