# MailArchiver - Docker based E-Mail Archive

### Why?
There are a lot of awesome options out there to archive your e-mails.
However, all of them were basically a mail-server to which you had to forward all your E-Mails.
I did not want that.<br>
Instead, I was looking for a solution that is constantly logged into my accounts and watches my inboxes.
Any time a new e-mail arrives, it quickly saves a copy and then waits for the next e-mail.<br>
Because I could find no such solution I created one myself.

### How?
This is a NodeJS script meant to be run in a docker container (though it could also be run standalone with a little modification).<br>
It automatically stores all new mails as files (as txt, html and json) using a directory structure based on the e-mail which recieved the mail, the current date and the subject of the e-mail.

To get started, simply type in the following command.
```
docker run -v <your-directory>:/archive -e user="<your-username>" -e password="<your-password>" -e host="<your-imap-host>" -e port="<your-imap-port>" -e name="<your-mail-name>" --name <your-container-name> -d robinweitzel/mail-archiver
```
Fill in the variables:
* \<your-directory>: a directory on the host machine where all mails are saved
* \<your-username> : the username with which you log into your mail account
* \<your-password>: the password with which you log into your mail account
* \<your-imap-host>: the host address for the IMAP access (check with your provider if you dont know that one)
* \<your-imap-port>: the imap port (usually 993)
* \<your-mail-name>: the folder name under which all emails from this email address will be archived
* \<your-container-name>: the name of the container within docker

Once running, the script will store all new e-mails in the corresponding directory.
