<h1 align="center">
  supermarket chatbot
</h1>

<p align="center">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/lucasvtiradentes/supermarket-chatbot.svg">
  <a href="https://github.com/lucasvtiradentes/supermarket-chatbot/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/lucasvtiradentes/supermarket-chatbot.svg">
  </a>

  <a href="https://github.com/lucasvtiradentes/supermarket-chatbot/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/lucasvtiradentes/supermarket-chatbot.svg">
  </a>

</p>

<p align="center">
  <a href="#information_source-description">Description</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; <a href="#information_source-features">Features</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-how-to-edit-it">How to edit it?</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-how-to-publish-it">How to publish it?</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-how-it-works">How it works?</a>
</p>

## :information_source: Description

This is an auto-updatable elctron whatsapp chatbot made for sending supermarket customers warning and informative messages whenever needed.

In order to this app be useful, you'll to store the messages you want to send to the costumers in a mongodb collection. To automate this purpose, you can use [supermarket-chatbot-api](https://github.com/lucasvtiradentes/supermarket-chatbot-api).

<p align="center">

<table align="center" style="width: 100%">
  <tr>
    <td style="text-align: center; font-weight: bold;">Program tour</td>
    <td style="text-align: center; font-weight: bold;">Sending messages</td>
  </tr>
  <tr>
    <td><img style="width: 100%" src="https://i.giphy.com/media/j5VvtauxPp03GSv9Xu/giphy.webp"></td>
    <td><img style="width: 100%" src="https://i.giphy.com/media/jTqpGDFZtaQD63msBg/giphy.webp"></td>
  </tr>
 </table>
</p>

## :information_source: Features

__General use cases:__
- [x] Automatic updates, by using [Electron-build](https://www.electron.build/) and [AWS S3](https://aws.amazon.com/pt/s3);
- [x] Keyboard shortcuts for easier customer experience;
- [x] Indication of the current operation that the bot performs on the icon at the top left;
- [x] Indication if the user has the required conditions for the bot to operate in the lower left part icons;
- [x] Indication of the number of messages sent, both on the current day and throughout the period;
- [x] Indication of how many pending messages the bot is sending, so that there is a number next to the `whatsapp icon`;
- [x] Indication of how many messages the bot operator should contact to inform customers, with a number next to the `manual messages icon`;
- [x] List of customers who must be contacted manually because they don't have a whatsapp number. In addition, the content of the generated message is shown, allowing quick communication of incidents to customers.

__Advanced use cases:__
- [x] It is possible to define a user to be responsible for *N* market;
- [x] If one day we have the KEY to use the Whatsapp Business API, we can only change the way of sending messages to customers;
- [x] If you run the program from a terminal, it is possible to see auxiliary log messages.

## :information_source: Technologies

This project uses the following technologies:

<div align="center" style="text-align: center;">
  <table>
    <tr>
      <th>Scope</th>
      <th>Technologies</th>
    </tr>
    <tr>
      <td>engine</td>
      <td align="center">
        <a target="_blank" href="https://nodejs.org"><img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"></a>
      </td>
    </tr>
    <tr>
      <td>main</td>
      <td align="center">
        <a target="_blank" href="https://www.electronjs.org/"><img src="https://img.shields.io/badge/electron-%2320232a.svg?style=for-the-badge&logo=electron&logoColor=%2361DAFB"></a>
      </td>
    </tr>
    <tr>
      <td>secondary</td>
      <td align="center">
        <a target="_blank" href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"></a>
        <a target="_blank" href="https://aws.amazon.com/"><img src="https://img.shields.io/badge/AWS S3-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white"></a>
      </td>
    </tr>
    <tr>
      <td>dev tools</td>
      <td align="center">
        <a target="_blank" href="https://eslint.org/"><img src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white"></a>
        <a target="_blank" href="https://editorconfig.org/"><img src="https://img.shields.io/badge/editorconfig-gray?style=for-the-badge&logo=editorconfig&logoColor=white"></a>
      </td>
    </tr>
  </table>
</div>


## :information_source: How to edit it

To clone this repository and make changes in the source code, you'll need [Git](https://git-scm.com) and  [Nodejs](https://nodejs.org/en/) in your computer.

```bash
# Clone this repository
$ git clone https://github.com/lucasvtiradentes/supermarket-chatbot

# Go into the repository
$ cd supermarket-chatbot

# Install dependencies
$ npm install

# Run the code in devlopment mode
$ npm run dev
```

## :information_source: How to publish it

To build an installable binary, run the following command:
```bash
# Build the binary install setup
npm run build
```

To effectvly use the auto-update feature, you'll have to publish the install to an amazon S3 property. And to do that, make sure to:
- Create an AWS S3 property to this chatbot;
- Update package.json `build` settings to use your S3 property;
- Get the credentials and setup in your computer.

To build an installable binary, run the following command:
```bash
# Publish the version into AWS S3
npm run publish
```

## :information_source: How it works

__Operation details__

- Each user can only operate if they have a validation key, which are registered in a `collection` in the database;
- Due to the asynchronous nature of electron, the operations of stopping and activating the bot are not instantaneous, so these intermediate states were introduced in the application.

__About the structure of the bot__

- The bot's folder structure is heavily influenced by the asynchronous nature of electron, which in a nutshell doesn't "wait" for the output of commands.
- Therefore, the project was divided into three parts:
  - __interface_window__: it's the look of the program, responsible for the settings part and for hosting the `webview` of whatsapp.
  - __worker_window__: Invisible window responsible for searching messages in the database parallel to the interface. It was created with the intention of not blocking the `window interface` during synchronous database queries.
  - __main__: responsible for orchestrating the program, making the connection between `interface` and `worker`. It, for example, receives the results of the `worker` query and evaluates whether or not it has messages.

__About message search__

- In a simple way, after checking if the necessary conditions (internet, database and settings) are satisfied, the bot is continuously checking if there are pending messages in the database.
  - If they exist, it sends an `event` to the `interface` to send the messages;
  - If they don't exist, it waits a certain amount of time (defined in `configs.json`) before checking again.

__About sending messages__

- When the array of messages arrives to be sent, a check is made if in fact the message should be sent.
  - If yes, try to send the message;
  - Otherwise, the status of the message is changed from `pending` to `unrequired` in the database. An example of a message that does not need to be sent is when the order has no occurrences.
- When trying to send the message:
  - if the customer number does not exist, the status of the message is changed from `pending` to `error`, in addition to this order being saved locally in the market, which can be consulted in the `manual orders` tab;
  - if there is a customer number, the bot waits until the message is actually sent. To do so, it performs a loop waiting for the last message sent by the user to be the same as the one he theoretically should send, in addition to checking whether the message has a `check` or `double check`.
- When you finish sending the message, change the message status from `pending` to `sent`.

__About updating tables and charts__

- Tables are updated:
  - At the beginning of an attempt to send a message to a customer;
  - When a client is added to the `manual clients` category.
- Graphics are updated:
  - At the beginning of an attempt to send a message to a customer;
  - When changing the graphics content (`CTRL+G`).

__About non-recommended actions and possible errors__

It is not advisable to close the bot right after sending a message, since it is possible that its status in the database has not yet been changed to `sent`, which could cause the client to receive the same message.

__Keyboard shutcuts__

<div align="center" style="text-align: center;">
  <table>
    <tr>
      <th>Shotcut</th>
      <th>Action</th>
    </tr>
    <tr>
      <td>Ctrl + 1</td>
      <td align="left">Go to the  dashboard screen.</td>
    </tr>
    <tr>
      <td>Ctrl + 2</td>
      <td align="left">Go to the manual messages screen.</td>
    </tr>
    <tr>
      <td>Ctrl + 3</td>
      <td align="left">Go to the settings screen.</td>
    </tr>
    <tr>
      <td>Ctrl + 4</td>
      <td align="left">Go to the whatsapp screen.</td>
    </tr>
    <tr>
      <td>Ctrl + H</td>
      <td align="left">Vai para a tela home.</td>
    </tr>
    <tr>
      <td>Ctrl + U</td>
      <td align="left">Check chatbot updates.</td>
    </tr>
    <tr>
      <td>Ctrl + G</td>
      <td align="left">Change the dashboard charts view mode.</td>
    </tr>
    <tr>
      <td>Ctrl + R</td>
      <td align="left">Restart the program.</td>
    </tr>
    <tr>
      <td>Ctrl + F4</td>
      <td align="left">Closes the program.</td>
    </tr>
    <tr>
      <td>Ctrl + Space</td>
      <td align="left">Toogles the bot, turn it on/off.</td>
    </tr>
  </table>
</div>

__Program icon meaning__

<div align="center" style="text-align: center;">
  <table>
    <tr>
      <th>Image</th>
      <th>Current operation</th>
    </tr>
    <tr>
      <td><img src="https://i.ibb.co/d2G20V3/image.png"></td>
      <td align="left">Bot is turned off.</td>
    </tr>
    <tr>
      <td><img src="https://i.ibb.co/rpT0mDC/image.png"></td>
      <td align="left">Turning the bot on.</td>
    </tr>
    <tr>
      <td><img src="https://i.ibb.co/80M7tV9/image.png"></td>
      <td align="left">Looking for new messages.</td>
    </tr>
    <tr>
      <td><img src="https://i.ibb.co/7vQKCgk/image.png"></td>
      <td align="left">Sending messages.</td>
    </tr>
    <tr>
      <td><img src="https://i.ibb.co/W2wL27d/image.png"></td>
      <td align="left">Bot is not working.</td>
    </tr>
  </table>
</div>

---

Made with ♥ by Lucas Vieira.

Get it touch: [github](https://github.com/lucasvtiradentes) | [linkedin](https://www.linkedin.com/in/lucasvtiradentes) | lucasvtiradentes@gmail.com
