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
        from: 'concretecoating@gmail.com',
        subject: 'New Rock Solid Inquiry from ' + company,
        text: message,
        html: '<p>Message from: ' + name + ':</p><p>' + message + '</p>',
        to: 'concretecoating@gmail.com',
        'h:Reply-To': email
    }
}

app.post('/', async (req, res) => {
    // Get Mailgun key query param
    const client = req.query.mg_key

    // Get a Mailgun client
    const mailgun = new Mailgun({ apiKey: client, domain: 'coatedconcrete.com' })

    const result = createEmail(req.body)

    try {
        await mailgun.messages()
            .send(result, (error, body) => {
                if (error) {
                    res.status(500).json({ error: error })
                }
                res.status(200).json({ body: body.message })
            })
    } catch (error) {
        next(error)
    }
})

exports.sendMailgunEmail = functions.https.onRequest(app);
