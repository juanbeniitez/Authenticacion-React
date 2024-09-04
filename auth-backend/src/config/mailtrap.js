import { MailtrapClient } from 'mailtrap';

const mailtrapClient = new MailtrapClient({
  token: `f5ae43768c6ab0d0d98cefd6c4775eb6`,
});

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};

export {mailtrapClient, sender};

