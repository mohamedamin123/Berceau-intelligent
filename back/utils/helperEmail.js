const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./../.env" });

class HelperEmail {
    // Configuration du transporteur SMTP
    static transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // false pour STARTTLS, true pour SSL
        auth: {
            user: process.env.SMTP_EMAIL_USER,
            pass: process.env.SMTP_EMAIL_PASS,
        },
    });

    // Fonction qui génère les options de l'email
    static mailOptions(email, resetCode) {
        if (!email || !resetCode) {
            throw new Error("Email et code de réinitialisation sont requis.");
        }

        return {
            from: '"Berceau" <berceauberceau0@gmail.com>',
            to: email,
            subject: "Réinitialisation de votre mot de passe",
            text: `Bonjour,\n\nVoici votre code de réinitialisation de mot de passe : ${resetCode}\n\nCe code expirera dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.`,
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f7fa;
                                color: #333;
                                padding: 20px;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                border-radius: 8px;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                                padding: 30px;
                                text-align: center;
                            }
                            h1 {
                                color: #1d72b8;
                            }
                            p {
                                font-size: 16px;
                                line-height: 1.6;
                            }
                            footer {
                                font-size: 12px;
                                color: #888;
                                margin-top: 40px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Réinitialisez votre mot de passe</h1>
                            <p>Bonjour,</p>
                            <p>Nous avons reçu une demande pour réinitialiser le mot de passe de votre compte.</p>
                            <p>Voici votre code de réinitialisation :</p>
                            <h2>${resetCode}</h2>
                            <p>Ce code expirera dans 10 minutes.</p>
                            <footer>
                                <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
                                <p>Merci,</p>
                                <p>L'équipe Berceau</p>
                            </footer>
                        </div>
                    </body>
                </html>
            `,
        };
    }

    // Fonction d'envoi de l'email
    static async sendEmail(email, resetCode) {
        try {
            if (!email || !resetCode) {
                throw new Error("Email et code de réinitialisation sont requis.");
            }

            const mailOptions = this.mailOptions(email, resetCode);
            const info = await this.transporter.sendMail(mailOptions);

            console.log(`✅ Email envoyé à ${email} avec succès : ${info.response}`);
            return info;
        } catch (error) {
            console.error(`❌ Erreur lors de l'envoi de l'email à ${email}: ${error.message}`);
            throw new Error("L'envoi de l'email a échoué. Vérifiez vos identifiants SMTP et votre connexion.");
        }
    }
}

module.exports = HelperEmail;
