package com.example.appmobile.utils;

import android.content.Context;
import android.os.AsyncTask;
import android.widget.Toast;

import com.example.appmobile.ui.connexion.RegisterActivity;

import java.util.Properties;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class SendEmailTask extends AsyncTask<String, Void, Boolean> {

    private static final String SENDER_EMAIL = "mohamedaming146@gmail.com"; // Sender's email
    private static final String SENDER_PASSWORD = "obsg fuqv jrks sxhc"; // Sender's password
    private Context context; // Reference to any context (can be any activity)

    // Constructor to pass RegisterActivity
    public SendEmailTask(Context context) {
        this.context = context;
    }
    @Override
    protected Boolean doInBackground(String... params) {
        String recipientEmail = params[0];
        String verificationCode = params[1];

        // Setting up properties for SMTP server (Gmail in this case)
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com"); // Use Gmail SMTP server
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        // Create a session with the provided SMTP server configuration and authentication
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SENDER_EMAIL, SENDER_PASSWORD);
            }
        });

        try {
            // Create a message to send
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SENDER_EMAIL));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail));
            message.setSubject("Votre code de vérification");
            message.setText("Votre code de vérification est : " + verificationCode);

            // Send the email
            Transport.send(message);
            return true; // Email sent successfully
        } catch (MessagingException e) {
            e.printStackTrace();
            return false; // Email failed to send
        }
    }

    @Override
    protected void onPostExecute(Boolean success) {
        // Handle result in RegisterActivity
        if (context != null) {
            if (success) {
                Toast.makeText(context, "Code de vérification envoyé avec succès!", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(context, "Erreur lors de l'envoi de l'email.", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
