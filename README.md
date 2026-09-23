# Bad Ass Council

This web application is study, experiment and homebrew project for an irc-like chatting (with dcc-like file-sharing) intended for very small and private group (close friends, family, tiny communities).

Named after a small and imaginary village located in Lancre kingdom / Ramtops / [Discworld](https://wiki.lspace.org/Main_Page)

Purpose is to have some privacy and continous contact between members that are already acquainted to each other In Real Life.

## Technical

### Install backend

- database is hosted in postgresql 14+ (`apt install postgresql`) instance and manually created, use .sql scripts from the db then schema part. Don't forget to `chown -R postgres:postgres </pathto/badasscouncil-base>` and allow database path rights for `postgres` user. Several databases instances with customized dbname is not yet studied.

- using Spring Boot framework, openJDK/Java 17+.

- get the this part from the public repository, customize `application.properties`. For securiy reasons, you may change:

| Values of | Comments |
| ----------- | ----------- |
| password.salt | to have specific password hashes in your database |
| jwttoken.secret | to have specific JWT tokens, used to keep user session after authentification |
| server.ssl.key-* | SSL/TLS certificate store for the frontend to connect to the backend API |
| spring.datasource.* | at the least the password |
| cors.allow.origin | to lock on frontend's location |
| server.servlet.context-path | you may change this to `/<yourowninstancename>-api/v1` to order to avoid scrappers and bot-attacks |
| logging.level.org.springframework | INFO may be not necessary, WARN is advised |

- generate .jar archive with `./gradlew build`.

- install it in your server. On debian setup: `apt install openjdk-21-jre -y`, edit `deploy/badasscouncil.service` with correct paths in `ExecStart` and `WorkingDirectory`, and put it into `/etc/systemd/system/`.

- `WorkingDirectory` will contain the src/main/ressources/: `application.properties`, `logs` subfolder, `*.p12` (certificates store) and others assets outside the .war file.

- You may use a static symbolic link to fix versions updates/changes in the .war filename, such as `unlink /<pathto>/badasscouncil-backend.war && ln -s /<pathto>/badasscouncil-backend-<version>.war /<pathto>/badasscouncil-backend.war`.

- files are stored in ../uploads/* with UUID names. Uploads happen in ../uploads-temp/(fileId)-filename/*

- service is enabled and started with `systemctl enable|start|stop|status|disable badasscouncil-backend.service`.

### Install frontend

- written with Angular, since v22.
- get the this part from the public repository, you have to customize `src/app/env.ts` (same as backend's `server.servlet.context-path`) and maybe in `src/assets/*`
- generate html files `ng build`.
- install the built files from dist/badasscouncil-frontend/browser/* in your webserver. Use deploy/browser/.htaccess besides main-*.js and index.html to fix paths.

## Usage

### Administrators

- have access to settings = environmenent variables

| Family | Code | Comments |
| ----------- | ----------- | ----------- |
| Application | TIME_ZONE | will be used to cleaning jobs |
| CAPTCHA | LOGIN_QUESTION | Optional: if question and its reponse not blank, this will be displayed when signing in. Choose a private question, on which response is unknown to the internet |
| CAPTCHA | LOGIN_RESPONSE | |
| CAPTCHA | SUBSCRIBE_QUESTION | Same for the subscription formular |
| CAPTCHA | SUBSCRIBE_RESPONSE | |
| Messages | HOME_ERROR | Optional: if not blank, this error message will be displayed for all (even unlogged people) on the home page | 	  
| Messages | HOME_INFO | Same for information |
| Messages | HOME_MISC | Same for neutral |  
| Messages | HOME_WARN | Same for warning |
| Quota | MEMBERS_COUNT | maximum number of users in this instance |
| Quota | FILES_PER_MEMBER | maximum file a user can self own |
| Quota | FILE_SIZE | maximum file size (in MB) |
| Quota | STORAGE_DEFAULT | -1 : not yet allowed to upload, 0 : follows FILES_PER_MEMBER * FILE_SIZE limit, > 0 : limit in GB  |
| Users | SLEEPING_STATUS_AFTER | set SLEEPING status after N months of inactivity, 0 to avoid status change |

### Members / users

- members count is limited by a quota, fixed by the administrators.

- first subscription: the user becomes administrator, with 'active' state (= can sign in afterwards).

- next subscriptions: the user state is 'Pending', signing in will fail until an administrator or a regulator changes the user state to 'Active'. No email is sent (maybe in a later version ?); user must test logins or wait for an call from the team.

- don't confuse login name with nick name. Login name is for signing into the application and supposed to be secret, known by owning user and administrators (not regulators).

- an user's motive is mandatory at subscription (will be read only by administrators and regulators), use some details unknown from the public internet, such as a passphrase agreed upon between you and the team.

- indicating real name and contact details may help administrators and regulators recognize you and set your status as 'active' and allow signing in. User may leave it, displayed or not for the other users (administrators and regulators always see contact details), or reset at blank if privacy needs it.

- administrators and regulators can add and modify users, mostly to change their status. If indicated, passwords are changed. Leave this fields blank if it doesn't have to be reset. Indicated passwords do not have constraints (allowing easy word to communicate - very discreetly - to the user) and are set as expired, thus alerting and inviting the user to change it after signing in.

- users can read the whole users list, but without credentials to modify it. User can only change some datas of his account.

- note: email address are reset to blank if malformed.

- TODO? 2FA but no email method nor SMS?

### Attachments / uploaded files

- depending on the administrators quotas settings, users can upload files into the web application. There is a storage limit for each user (with general default value when subscription if made by user or creation done by administrators or regulators). There is also a number of files per user limit. And also a file size limit for each file.

- user can share the file for everyone with a share flag. Else, the file is seen only for him/her, administrators and a possible recipient user. Listed files are downloadble.

- user can change file property by changing its owner. The recipient user can claim or decline ownership from the attachments list. If claimed, the recipient user become the new owner and manage the
attachment for him/herself. If declined, the attachment may dissappear from recipient user file list.

- a file can have a lifespan, set in days: if set, automatic file deletion will happen at midnight.

### Rooms and chat

- currently same as an IRC-client, text only. User can send a message line to all or secretly to specific user.

- user can create a room and becomes the owner ie can administrate it (with administrators and regulators), mostly by setting informations and messages lines purge.

- a room can have its access restricted by:
   - password: all users must indicate it.
   - LOCKED state: access is granted only for its owner and administrators and regulators.
   - allowed or disallowed users list (set this at room edit/update, not (yet?) possible at room creation). Administrators and room's owner are not affected by these lists and will still have access. Regulators can be affected.

- latest 500 lines are downloaded, you can retreive backlog with antiwised clock icon button (500 lines per click).

- user can upload (group of) images, to all or a one user recipient. Thumbnails will appear as message line. A click on a thumbnail and plain image will be downloaded in new browser tab.

- URLs in messages are considered as pure text. User may copy/paste it into a new window. A lazier method is to add a web link from the dropdown formular. One web URL as message, naming it may help if the link is long.

- TODO? add emojis reactions on messages ?
- TODO? add internal links for cite/reply/react ?

### Cleaning jobs

- automatic purge for attachments, manually deleted/disabled or when lifespan is reached (at midnight).
- automatic time/number-limited messages and trashed rooms (every minutes).
- automatic users purge, for disabled accounts with no remaing messages (at midnight). Owned attachments are set disabled for pending purge.
- can set SLEEPING status on inactive users, after N months (at midnight).

### Miscellaneous

- TODO? app look'n'feel via CSS (skins or day/night swap?) ?
