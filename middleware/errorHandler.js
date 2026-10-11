module.exports=(err,req,res,next) => {
    if(err.name === "ValidationError"){
        return res.status(400).json({
            Message : err.message
        });
    }
    if(err.name === "CastError"){
        return res.status(400).json({
            Message : err.message
        });
    }
    return res.status(500).json({
        Message : err.message
    });
}