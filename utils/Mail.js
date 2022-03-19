const nodeMailer = require("nodemailer");
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID, 
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );
    
    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if(err) {
                reject("Failed to create access token");
            }
            else {
                resolve(token);
            }
        })
    });

    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env['GMAIL_NAME'],
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    return transporter;
}

// const transporter = nodeMailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     service: 'gmail',
//     secure: true,
//     auth: {
//         user: process.env['GMAIL_NAME'],
//         pass: process.env['GMAIL_PASSWORD']
//     }
// })

exports.sendMail = async (to, subject, text, html) => {
    const GMAIL_NAME = `Chat app <${process.env['GMAIL_NAME']}>`;
    const options = {
        from: GMAIL_NAME,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    let gmailTransporter = await createTransporter();

    return new Promise((resolve, reject) => {
        try {
            gmailTransporter.sendMail(options, (err, info) => {
                if(err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(info);
                }
            });
        }
        catch(err) {
            console.log(err);
            reject(err);
        }
    })
}
