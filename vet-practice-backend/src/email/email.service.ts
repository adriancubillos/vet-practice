import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // Replace with your SMTP server
      port: 587, // Use 465 for SSL, 587 for TLS
      secure: false, // set to true if using SSL
      auth: {
        user: 'your-email@example.com', // Replace with your email
        pass: 'your-email-password', // Replace with your email password
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'your-email@example.com', // Sender address
      to, // Recipient address
      subject, // Subject of the email
      text, // Plain text body
      // html: '<b>Hello world?</b>' // Optional HTML body
    };

    return this.transporter.sendMail(mailOptions);
  }
}