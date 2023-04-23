# Digital Logbook for Open Source Lab 
The OSL Digital Logbook is a project developed to enable users to log their entries using a digital logbook.
It is designed specifically for Open Source Lab (OSL) and can improvised to use for any entry system with minor changes in the code.
The logbook allows users to scan a QR code and log their entry into the lab. Before logging in, users must first register 
using a domain-specific email and verify their registration using OTP. 
The project is built using Node.js and MongoDB

## Features
- QR code scanning for logging entries, providing a quick and efficient process.
- Domain-specific email registration and OTP verification for user authentication.
- Geolocation support

## Installation and Usage Guide
To install and use the OSL Digital Logbook, please follow these instructions:

Make sure `node` and `mongodb` are installed on your system.

1. Clone the repository using the following command:
``` bash
git clone https://github.com/Asymmentric/oslLogBook.git
```
2. Install the required dependencies using the following command:
``` bash
cd oslLogBook
npm install
```
3. Create a file named `.env` and copy the following contents: 
``` env 
DB_LINK='<mongodb connection URL>'
DB_NAME='<database name>'

DB_LINK_DEV='<mongodb connection URL for dev env>'
DB_NAME_DEV='<database name>'

JWT_SECRET_TOKEN='<Secret JWT Token>'
SESSION_SECRET='<Your session secret>'

ACCOUNT_USER='<email to send OTP>'
ACCOUNT_PASSWORD='<email password>'
ACCOUNT_EMAIL_HOST='<email host smtp string>'
ACCOUNT_EMAIL_PORT='<email host port>'
ACCOUNT_EMAIL_SERVICE='<email service name>'
ACCOUNT_EMAIL_SEC_TYPE='<true or false>'
```
4. Modify the Regular Expressions as per the requirements:
  https://github.com/Asymmentric/oslLogBook/blob/7cf0e12b5e2554f368f1786fd0177ab3b733300a/server/util/pwdFunc.js#L25
``` javascript
    // replace the above line with this code snippet to accept all emails
    const emailOK=(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/).test((email).toLowerCase())
```
  https://github.com/Asymmentric/oslLogBook/blob/7cf0e12b5e2554f368f1786fd0177ab3b733300a/server/util/pwdFunc.js#L26
``` javascript
  // replace both lines `26` and `40` with this code snippet to accept all kind of USN/ Unique IDs
  const usnOK=(/.*/ig).test(usn)
  ```
  https://github.com/Asymmentric/oslLogBook/blob/7cf0e12b5e2554f368f1786fd0177ab3b733300a/server/util/pwdFunc.js#L39
``` javascript
    // replace both lines `25` and `39` with this code snippet to accept all emails
    const emailOK=(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/).test((userId).toLowerCase())
```
  
   https://github.com/Asymmentric/oslLogBook/blob/7cf0e12b5e2554f368f1786fd0177ab3b733300a/server/util/pwdFunc.js#L40
  ``` javascript
  // replace both lines `26` and `40` with this code snippet to accept all kind of USN/ Unique IDs
  const usnOK=(/.*/ig).test(userId)
  ```
5. Start the server using the following command:
``` bash
npm start
```
6. Navigate to `http://localhost:9090/oslLog/api/v1/scan/entry` in your web browser to use the logbook.

# Contributing Guidelines
Contributions to the OSL Digital Logbook are always welcome! If you'd like to contribute, please follow these guidelines:
- Submit an issue or feature request before submitting a pull request.
- Fork the repository and make your changes on a new branch.
- Submit a pull request with a detailed description of your changes.





