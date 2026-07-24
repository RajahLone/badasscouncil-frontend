# Bad Ass Council

This web application is study, experiment and homebrew project for an irc-like chatting (with dcc-like file-sharing) intended for very small and private group (close friends, family, tiny communities).

Named after a small and imaginary village located in Lancre kingdom / Ramtops / [Discworld](https://wiki.lspace.org/Main_Page)

Purpose is to have some privacy and continous contact between members that are acquainted to each other In Real Life.

WORK-IN-PROGRESS

## Technical

### Install backend

- using Spring Boot framework, since (openJDK)Java 17.
- get the this part from the public repository, customize `application.properties` and generate .jar archive with `./gradlew build`.
- install it in your server (TODO: description into debian local virtual machine).

- database is hosted in postgresql instance and manually created, use .sql scripts from the schema part.

#### Install frontend

- written with Angular, since v22.
- get the this part from the public repository, customize `src/app/env.ts` and `src/assets/*` and generate html files `ng build`.
- install it in your server (TODO: description with apache2 into debian local virtual machine).

## Usage

### Administrator(s)

- have access to settings = environmenent variables

| Family | Code | Comments |
| ----------- | ----------- | ----------- |
| Application | TIME_ZONE | will be used to cleaning jobs |
| CAPTCHA | LOGIN_QUESTION | Optional: if question and its reponse not blank, this will be displayed when signing in. Choose a private question, on which response is unknown to the internet. |
| CAPTCHA | LOGIN_RESPONSE | |
| CAPTCHA | SUBSCRIBE_QUESTION | Same for the subscription formular. |
| CAPTCHA | SUBSCRIBE_RESPONSE | |
| Messages | HOME_ERROR | Optional: if not blank, this error message will be displayed for all (even unlogged people) on the home page. | 	  
| Messages | HOME_INFO | Same for information. |
| Messages | HOME_MISC | Same for neutral. |  
| Messages | HOME_WARN | Same for warning. |
| Quota | MEMBERS_COUNT | maximum number of users in this instance. |

### Members / users

- members count is limited by a quota, fixed by the administrators.

- first subscription: the user becomes administrator, with 'active' state (= can sign in afterwards).

- next subscriptions: the user state is 'Pending', signing in will fail until an administrator or a regulator changes the user state to 'Active'. No email is sent (maybe in a later version ?); user must test logins or wait for an call from the team.

- don't confuse login name with nick name. Login name is for signing into the application and supposed to be secret, known by owning user and administrators (not regulators).

- an user's motive is mandatory at subscription (will be read only by administrators and regulators), use some details unknown from the public internet, such as a passphrase agreed upon between you and the team.

- indicating real name and contact details may help administrators and regulators recognize you and set your status as 'active' and allow signing in. User may leave it, displayed or not for the other users (administrators and regulators always see contact details), or reset at blank if privacy needs it.

- administrators and regulators can add and modify users, mostly to change their status. If indicated, passwords are changed. Leave this fields blank if it doesn't have to be reset. Indicated passwords do not have constraints (allowing easy word to communicate - very discreetly - to the user) and are set as expired, thus alerting and inviting the user to change it after signing in.

- users can read the whole users list, but without credentials to modify it. User can only change some datas of his account.

### Attachments / uploaded files

TODO

### Rooms and chat

TODO

### Cleaning jobs

TODO
