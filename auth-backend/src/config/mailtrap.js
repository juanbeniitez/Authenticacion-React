import { MailtrapClient } from 'mailtrap';

const mailtrapClient = new MailtrapClient({
  token: `${process.env.MAILTRAP_TOKEN}`,
});

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};

export {mailtrapClient, sender};

