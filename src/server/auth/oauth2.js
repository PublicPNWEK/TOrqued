const express = require('express')
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2')

const router = express.Router()

passport.use('provider', new OAuth2Strategy({
  authorizationURL: process.env.OAUTH_AUTH_URL,
  tokenURL: process.env.OAUTH_TOKEN_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.OAUTH_CALLBACK
}, (accessToken, refreshToken, profile, cb) => {
  cb(null, { accessToken, refreshToken })
}))

router.get('/auth', passport.authenticate('provider'))

router.get('/auth/callback', passport.authenticate('provider', { failureRedirect: '/login' }),
  (req, res) => { res.json({ ok: true }) }
)

module.exports = router
