module.exports = {
    getRate: (req, res) => {
        if (!('weight' in req.query && 'type' in req.query)) {
            return respond(res, {
                status: 400,
                headers: {
                    'Content-Type': 'text/html',
                },
                message: 'Bad request',
            });
        }

        let weight = req.query.weight;
        let type = req.query.type;
        let price;
        try {
            price = calculatePrice(weight, type);
        } catch (err) {
            return respond(res, {
                status: 400,
                headers: {
                    'Content-Type': 'text/html',
                },
                message: err,
            });
        }

        res.render('pages/price.ejs', {
            weight: weight,
            type: type,
            price: price,
        });
    },
};

const typeRateMap = {
    'letter-stamped': rateLetterStamped,
    'letter-metered': rateLetterMetered,
    'large-flat': rateLargeFlat,
    'first-class-retail': rateFirstClassRetail,
};

function rateLetterStamped(weight) {
    if (weight <= 1.0) {
        return 0.50;
    } else if (weight <= 2.0) {
        return 0.71;
    } else if (weight <= 3.0) {
        return 0.92;
    } else if (weight <= 3.5) {
        return 1.13;
    } else {
        return rateLargeFlat(weight);
    }
}

function rateLetterMetered(weight) {
    if (weight <= 1.0) {
        return 0.47;
    } else if (weight <= 2.0) {
        return 0.68;
    } else if (weight <= 3.0) {
        return 0.89;
    } else if (weight <= 3.5) {
        return 1.10;
    } else {
        return rateLargeFlat(weight);
    }
}

function rateLargeFlat(weight) {
    if (weight <= 1.0) {
        return 1.00;
    } else if (weight <= 2.0) {
        return 1.21;
    } else if (weight <= 3.0) {
        return 1.42;
    } else if (weight <= 4.0) {
        return 1.63;
    } else if (weight <= 5.0) {
        return 1.84;
    } else if (weight <= 6.0) {
        return 2.05;
    } else if (weight <= 7.0) {
        return 2.26;
    } else if (weight <= 8.0) {
        return 2.47;
    } else if (weight <= 9.0) {
        return 2.68;
    } else if (weight <= 10.0) {
        return 2.89;
    } else if (weight <= 11.0) {
        return 3.10;
    } else if (weight <= 12.0) {
        return 3.31;
    } else if (weight <= 13.0) {
        return 3.52;
    } else {
        throw `Invalid weight ${weight}`;
    }
}

function rateFirstClassRetail(weight) {
    if (weight <= 4.0) {
        return 3.50;
    } else if (weight <= 8.0) {
        return 3.75;
    } else if (weight <= 9.0) {
        return 4.10;
    } else if (weight <= 10.0) {
        return 4.45;
    } else if (weight <= 11.0) {
        return 4.80;
    } else if (weight <= 12.0) {
        return 5.15;
    } else if (weight <= 13.0) {
        return 5.50;
    } else {
        throw `Invalid weight ${weight}`;
    }
}

function calculatePrice(weight, type) {
    if (!(type in typeRateMap)) {
        throw `Unknown type "${type}"`;
    } else if (isNaN(weight) || weight <= 0) {
        throw `Invalid weight "${weight}"`;
    }

    let getRate = typeRateMap[type];
    return getRate(weight) * weight;
}

function respond(res, obj) {
    res.status(obj.status);
    for (let key of obj.headers) {
        res.set(key, obj.headers[key]);
    }
    res.send(obj.message);
}