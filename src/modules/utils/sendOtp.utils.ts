const axios = require('axios');
const { Twilio } = require('twilio');
const { msg } = require('../config');
// const env = require("../environment/environment");
const accountSid: string | undefined = process.env.TWILIO_ACCOUNT_SID;
const authToken: string | undefined = process.env.TWILIO_AUTH_TOKEN;

export const SendOtp = async (countryCode: number, phone: number, OTP: string) => {
    try {
        console.log(countryCode, phone, OTP)
        if (countryCode.toString().trim() === '91') {
            console.log('Sending Indian OTP');

            // TODO: Send Indian OTP
            // await TwilloSendSms(countryCode + phone.toString(), OTP);
            return msg.success;
        } else {
            // await sendSlackOtp(OTP);
            // await TwilloSendSms(countryCode + phone.toString(), OTP);
            return msg.success;
        }
    } catch (error) {
        throw error;
    }
}

async function TwilloSendSms(phone: string, otp: string) {
    console.log(phone)
    const client = new Twilio(accountSid, authToken);
    const message = await client.messages.create({
        body: `Social - Your OTP is ${otp}`,
        from: "+14692566431",
        to: `+${phone}`,
    });
    // const message = await client.messages.create({
    //     body: `Social - Your OTP is ${otp}`,
    //     messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
    //     to: phone,
    // });
    // console.log('twilio-message', message)
    console.log('twilio-message.sid', message.sid);
}

async function sendSlackOtp(otp: string) {
    // curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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

    const r = await axios.post('https://hooks.slack.com/services/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', {
        text: `Social - Your OTP is ${otp}`,
    });
    console.log(r.data);
}


export const sendSms = async (mobile: string, smsBody: string) => {
    const client = new Twilio(accountSid, authToken);
    try {
        let response = await client.messages.create({
            body: smsBody,
            // to: mobile
        })
        if (response) {
            return {
                msg: msg.otpSent,
                sid: response.sid
            }
        }
    } catch (error) {
        throw error
    }
}