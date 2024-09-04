import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailtTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.js"

const sendVerificationEmail = async (email, verificationToken) => {
    const recipients = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("verificationCode", verificationToken),
            category: "Email verification"
        });

        console.log("Email sent succesfully", response);
    } catch (error) {
        console.log("Error sending verification email: " + error);
        throw new Error("Error sending verification email: " + error);
    }
}

const sendWelcomeEmail = async (email, name) => {
    const recipients = [{email}];

    try {
        const response = await mailtrapClient
        .send({
          from: sender,
          to: recipients,
          template_uuid: "ec618797-bed5-4186-a342-b6197e65d461",
          template_variables: {
            "company_info_name": "Auth Company",
            "name": name
          }
        })

        console.log("Welcome email sent succesfully", response);
    } catch (error) {
        console.log("Error sending verification email: " + error);
        throw new Error("Error sending verification email: " + error);
    }
}

const sendForgotPasswordEmail = async (email, recoveryUrl) => {
    
    const recipients = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Reset yout password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", recoveryUrl),
            category: "Password reset",
        });

        console.log("Forgot password email sent succesfully", response);
    } catch (error) {
        console.log("Error sending forgot password email: " + error);
        throw new Error("Error sending forgot password email: " + error);
    }
}

export {sendVerificationEmail , sendWelcomeEmail, sendForgotPasswordEmail};