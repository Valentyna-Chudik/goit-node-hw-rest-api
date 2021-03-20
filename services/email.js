const Mailgen = require("mailgen");
const sgMail = require("@sendgrid/mail");
const config = require("../config/email.json");

require("dotenv").config();

class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;
  constructor(env) {
    switch (env) {
      case "development":
        this.link = config.dev;
        break;

      case "stage":
        this.link = config.stage;
        break;

      case "production":
        this.link = config.prod;
        break;

      default:
        this.link = config.dev;
        break;
    }
  }

  #createTemplate(verificationToken) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: "cerberus",
      product: {
        name: "Phonebook App",
        link: this.link,
      },
    });
    const emailTemplate = {
      body: {
        intro:
          "Welcome to Phonebook App! We're very excited to have you on board.",
        action: {
          instructions: "To get started with Phonebook App, please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `${this.link}/api/users/auth/verify/${verificationToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(emailTemplate);
  }

  async sendEmail(verificationToken, email) {
    const emailBody = this.#createTemplate(verificationToken);
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: "valentynachudik@gmail.com",
      subject: "Welcome to Phonebook App! Confirm Your Email",
      html: emailBody,
    };
    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
