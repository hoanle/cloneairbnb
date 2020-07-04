const Globals = require("./../configs/Globals");
const CronJob = require("cron").CronJob;
const mailgun = require("mailgun-js");

exports.sendVerificationEmail = (email, token) => {
  let date = new Date();
  date.setSeconds(date.getSeconds() + 15);
  console.log(date);
  console.log(Globals.mailgunEmail);
  console.log(Globals['mailgunEmail']);
  var cron = new CronJob(date, async () => {
    const mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
    const verificationUrl = `${process.env.VERIFICATION_URL}?verificationToken=${token}`;
    console.log(verificationUrl);
    const data = {
      from: `CloneAirBnb <${Globals.mailgunEmail}>`,
      to: `${email}, hoanle@xtaypro.com`,
      subject: "Verify your account",
      html: `Welcome from CloneAirBnb! 
                <br>Your email is used to register at CloneAirBnb</br>
                <a href="${verificationUrl}">Click here to verify (valid for 7 days).</a>`,
    };
    mg.messages().send(data, function (error, body) {
      console.log(body);
    });
  });
  cron.start();
};
