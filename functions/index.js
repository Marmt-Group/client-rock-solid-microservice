const functions = require('firebase-functions');
const Mailgun = require('mailgun-js')
const express = require('express');
const cors = require('cors');
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.options('*', cors())

const createEmail = (data) => {
    const { name, email, company, message } = data

    return {
        from: 'davidjamesdavis.djd@gmail.com',
        subject: 'New Marmt Inquiry from ' + company,
        text: message,
        html: '<p>Message from: ' + name + ': ' + message + '</p>',
        to: 'theedoubled@gmail.com',
        'h:Reply-To': email
    }
}

app.post('/', async (req, res) => {
    // Get Mailgun key query param
    const client = req.query.mg_key

    // Get a Mailgun client
    const mailgun = new Mailgun({ apiKey: client, domain: 'sandboxc33e3cce97ba4056a2cda617798410ee.mailgun.org' })

    const result = createEmail(req.body)

    try {
        await mailgun.messages()
            .send(result, (error, body) => {
                if (error) {
                    res.status(500).json({ error: error })
                }
                res.status(200).json({ body: body })
            })
    } catch (error) {
        next(error)
    }
})

exports.sendMailgunEmail = functions.https.onRequest(app);
