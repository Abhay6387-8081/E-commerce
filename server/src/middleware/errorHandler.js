export function errorHandler(err,req,res,next){
    const statusCode = err.statusCode||500;
    const message = err.message||'Something went wrong. Please try again.';

    if(process.env.NODE_ENV!=='production'){
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success:false,
        error:message,
    });
}