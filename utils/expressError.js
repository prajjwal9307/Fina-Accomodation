class expressError extends Error{
    constructor(statusCode,massege){
        super();
        this.statusCode=statusCode;
        this.message=massege;
    }
}
module.exports=expressError;