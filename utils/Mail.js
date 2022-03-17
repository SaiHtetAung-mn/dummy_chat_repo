const nodeMailer = require("nodemailer");
const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env['GMAIL_NAME'],
        pass: process.env['GMAIL_PASSWORD']
    }
})
const GMAIL_NAME = `Chat app <${process.env['GMAIL_NAME']}>`;

exports.sendMail = (to, subject, text, html) => {
    const options = {
        from: GMAIL_NAME,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    return new Promise((resolve, reject) => {
        try {
            transporter.sendMail(options, (err, info) => {
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