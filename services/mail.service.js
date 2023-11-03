import { createTransport } from 'nodemailer';

class MailService {
	transporter;

	async sendActivationMail(to, link) {
		if (!this.transporter) {
			this.transporter = createTransport({
				host: process.env.SMTP_HOST,
				port: process.env.SMTP_PORT,
				secure: false,
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASSWORD,
				},
			});
		}

		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: `Account Activation on ${process.env.API_URL}`,
			text: '',
			html: `
				<div>
					<h1>Activate your account: </h1>
					<a href="${link}">${link}</a>
				</div>
			`,
		});
	}
}

export default new MailService();
