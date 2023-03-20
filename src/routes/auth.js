const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken')
const router = express.Router();
const config = require('../config')

router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
    res.json(
        {
            message: 'Signup successful',
            user: req.user
        }
    );
}
);

router.post('/login', async (req, res, next) => {passport.authenticate(
            'login',
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occurred.');
                        return next(error);
                    }
                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);
                            const body = { _id: user._id, email: user.email };
                            const token = jwt.sign({ user: body }, config.jwtSecret);
                            return res.json({
                                token, user: {
                                    _id: user._id,
                                    email: user.email,
                                    savedMovies: user.savedMovies,
                                    name: user.name
                                }
                            });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

module.exports = router;