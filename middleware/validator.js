module.exports = (validate) => {
    return (req, res, next) => {
        let {error} = validate(req.body);
        if(error) {
            return res.status(400).send(error);
        }
        next();
    }
};
