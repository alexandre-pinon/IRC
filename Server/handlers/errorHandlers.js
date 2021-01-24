exports.catchErrors = (f) => {
    return function (request, response, next) {
        f(request, response, next).catch((error) => {
            if (typeof error === "string") {
                response.status(400).json({
                    message: error
                })
            } else {
                next(error)
            }
        })
    }
}

exports.notFound = (request, response, next) => {
    response.status(404).json({
        message: 'Route not found'
    })
}

exports.mongooseErrors = (error, request, response, next) => {
    if (!error.errors) {
        return next(error)
    }

    let message = ''
    const errorKeys = Object.keys(error.errors)

    errorKeys.forEach((key) => (
        message += error.errors[key].message + ', '
    ))

    message = message.substr(0, message.length - 2)

    response.status(400).json({ message })
}

exports.developmentErrors = (error, request, response, next) => {
    error.stack = error.stack || ''
    const errorDetails = {
        message: error.message,
        status: error.status,
        stack: error.stack
    }

    response.status(error.status || 500).json(errorDetails)
}

exports.productionErrors = (error, request, response, next) => {
    response.status(error.status || 500).json({
        error: 'Internal Server Error'
    })
}