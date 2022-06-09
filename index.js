const express = require('express')
const axios = require('axios')
const app = express()
require('dotenv').config()
var bodyParser = require('body-parser')

// The URLS are dynamically configured depending on your sandboxMode value
let mso = process.env.MSO
let api_key = process.env.API_KEY
let domain = process.env.DOMAIN

app.use(express.text())

app.put('/', async (request, response) => {
    let merchants = request.body.split('\n');
    let merchant_status = []



    var updater_loop = new Promise((resolve, reject) => {
        merchants.forEach(async (merchant, index, array) => {
            console.log("> Updating merchant: " + merchant)
            let authHeaderBuffer = Buffer.from("MSO." + mso + ":" + api_key)
            let authHeader = authHeaderBuffer.toString('base64');
            try {
                // Firing Generate Purchase Invoice request
                await axios.default.put(
                    domain + "/api/rest/version/64/mso/" + mso + "/merchant/" + merchant,
                    {
                        apiOperation: "UPDATE_MERCHANT_PAYMENT_DETAILS",
                        merchant: {
                            cardMaskingFormat: "DISPLAY_6_4",
                            systemCapturedCardMaskingFormat: "DISPLAY_6_4",
                            service: [
                                "ENABLE_NOTIFICATIONS",
                                "ENABLE_WEB_SERVICES_API"
                            ],
                            privilege: [
                                "SECURECODE_2",
                                "VERIFIED_BY_VISA_2",
                                "ALLOW_ACQUIRER_TRACE_ID",
                                "AUTHORIZATIONS",
                                "AUTO_AUTH_REVERSAL_ON_EXPIRY",
                                "CAPTURES",
                                "MOTO",
                                "PSD2_EXEMPTIONS",
                                "PURCHASES",
                                "REFUNDS",
                                "STANDALONE_REFUNDS",
                                "UPDATE_AUTHORIZATION",
                                "VOIDS"
                            ]
                        }
                    },
                    {
                        headers: {
                            'Authorization': "Basic " + authHeader,
                        }
                    }
                )
                // Merchant updated successfully
                console.log("Merchant updated successfully: " + merchant)
                merchant_status.push({
                    merchant: merchant,
                    updated: true
                })
            }
            catch (error) {
                // Merchant update failed
                console.log("Error while attempting to update merchant " + error)
                merchant_status.push({
                    merchant: merchant,
                    updated: false
                })
            }
            if (index === array.length -1) resolve();
        })
    });

    updater_loop.then(() => {
        response.status(200).send({ result: merchant_status })
    });

})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})
