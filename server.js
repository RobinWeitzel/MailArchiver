const notifier = require('mail-notifier');
const jetpack = require('fs-jetpack');
const sanitize = require("sanitize-filename");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const imap = {
    user: process.env.user,
    password: process.env.password,
    host: process.env.host,
    port: process.env.port, // 993
    tls: true,// use secure connection
    tlsOptions: { rejectUnauthorized: false },
    markSeen: false
};

const url = process.env.mongourl; // i.e. 'mongodb://localhost:27017'
const dbName = process.env.mongodb;
const inboxName = process.env.name;

n = notifier(imap);

// Create a new MongoClient
if (url !== 'url') {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, database) => {
        if (err) throw err;

        const client = database;
        const db = client.db(dbName);

        n.on('end', () => n.start()) // session closed
            .on('error', () => { if(error.code === 'ECONNRESET') { setTimeout(() =>{ n.stop(); n.start(); }, 5000); }})
            .on('mail', mail => {
                if (mail !== undefined) {
                    const root = "../archive"; // To bind, use -v /storage/mail_archiver:/archive
                    const inbox = inboxName;
                    const year = mail.date.getFullYear();
                    const month = mail.date.getMonth() + 1;
                    let day = mail.date.getDate();
                    if (day === 0) {
                        day = 7;
                    }
                    let subject = sanitize(mail.subject || "empty-subject");
                    if (subject === "") {
                        subject = "empty-subject";
                    }
                    const id = mail.uid;

                    const path = root + "/" + inbox + "/" + year + "/" + month + "/" + day + "/" + subject + "/" + id + "/";

                    jetpack.write(path + "email.json", JSON.stringify(mail));
                    jetpack.write(path + "email.txt", mail.text || "");
                    jetpack.write(path + "email.html", mail.html || "");

                    const collection = db.collection(inbox);
                    collection.ensureIndex("uid", () => {
                        collection.update(mail.uid, mail, {upsert: true});
                    });   
                }
            })
            .start();
    });
} else {
    const n = notifier(imap);

    n.on('end', () => n.start())
        .on('error', () => { if (error.code === 'ECONNRESET') { setTimeout(() => { n.stop(); n.start(); }, 5000); } })
        .on('mail', mail => {
            if (mail !== undefined) {
                const root = "../archive"; // To bind, use -v /storage/mail_archiver:/archive
                const inbox = inboxName;
                const year = mail.date.getFullYear();
                const month = mail.date.getMonth() + 1;
                let day = mail.date.getDate();
                if (day === 0) {
                    day = 7;
                }
                let subject = sanitize(mail.subject || "empty-subject");
                if (subject === "") {
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
}




