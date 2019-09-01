const express = require('express')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')

const wordlistRouter = require('./controllers/wordlist.controller')
const UserDao = require('./dao/user.dao');
const config = require('./config');

var jwtStrategyOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecretKey,
    authScheme : 'Bearer',
    issuer: config.domain,
    // opts.audience : 'yoursite.net';
}


passport.use(new JwtStrategy(jwtStrategyOpts, async (jwt_payload, done) => {
    try {
        const user = await UserDao.findOne({ _id: mongoose.Types.ObjectId(jwt_payload.userId) })
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

const app = express()
app.use(passport.initialize());
app.use(passport.authenticate('jwt', { session: false }));

app.get('/', (req, res) => res.status(200).send('ok'))
app.use('/wordlists', express.json(), wordlistRouter)



module.exports = app