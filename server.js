const notifier = require('mail-notifier');
const jetpack = require('fs-jetpack');
const sanitize = require("sanitize-filename");

const imap = {
  user: process.env.user, 
  password: process.env.password, 
  host: process.env.host, 
  port: process.env.port, // 993
  tls: true,// use secure connection
  tlsOptions: { rejectUnauthorized: false },
  markSeen: false
};

n = notifier(imap);

n.on('end', () => n.start()) // session closed
    .on('mail', mail => {
        if(mail !== undefined) {
            const root = "../archive"; // To bind, use -v /storage/mail_archiver:/archive
            const inbox = process.env.name;
            const year = mail.date.getFullYear();
            const month = mail.date.getMonth() + 1;
            let day = mail.date.getDate();
            if(day === 0) {
                day = 7;
            }
            let subject = sanitize(mail.subject || "empty-subject");
            if(subject === "") {
                subject = "empty-subject";
            }
            const id = mail.uid;

            const path = root + "/" + inbox + "/" + year + "/" + month + "/" + day + "/" + subject + "/" + id + "/";

            jetpack.write(path + "email.json", JSON.stringify(mail));
            jetpack.write(path + "email.txt", mail.text || "");
            jetpack.write(path + "email.html", mail.html || "");
        }
    })
    .start();