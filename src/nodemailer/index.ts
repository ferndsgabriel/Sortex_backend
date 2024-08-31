import nodemailer from "nodemailer";

export async function SendEmail(email: string, message: string) {
    const formatEmail = email.toLowerCase().trim();

    const user = process.env.NODEMAILER_EMAIL;
    const pass = process.env.NODEMAILER_PASS;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: false,
        port: 587,
        auth: { user, pass },
    });

    try {
        // Verifica a conexão com o servidor
        await new Promise<void>((resolve, reject) => {
            transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                    return reject(error);
                } else {
                    console.log("Server is ready to take our messages");
                    return resolve();
                }
            });
        });

        // Envia o email
        await new Promise<void>((resolve, reject) => {
            transporter.sendMail(
                {
                    from: user,
                    to: formatEmail,
                    subject: "Email de sortex",
                    html: message,
                },
                (error, info) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    } else {
                        console.log("sucess", info);
                        return resolve();
                    }
                }
            );
        });

        return { ok: true };
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}
