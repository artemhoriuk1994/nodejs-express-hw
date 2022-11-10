function tryCatchWrapper(endPointFn) {
    return async (req, res, next) => {
        try {
            await endPointFn(req, res, next)
        } catch (err) {
            next(err)
        }
    };
};

function NotFoundHttpError() {
    const err = new Error("Not Found")
    err.status = 404;
    return err
}

function BadRequestHttp(message) {
    const err = new Error(message)
    err.status = 400;
    return err
}

module.exports = {
    tryCatchWrapper,
    NotFoundHttpError,
    BadRequestHttp
}