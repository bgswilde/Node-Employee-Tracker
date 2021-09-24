
  # Node Employee Tracker
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  ## Description
  This application uses Node to connect to and display data from a mysql database. In doing so, I've utilized the following technologies:
  - JavaScript
  - Node.js (with inquirer and console.table packages)
  - MySQL

  ## Table of Contents
  * [Installation](#installation)
  * [Usage](#usage)
  * [Credits](#credits)
  * [License](#license)
  * [Contributing](#contributing)
  * [Tests](#tests)
  * [Questions](#questions)
  
  ## Installation
  Use the command 'git clone' in your command line with the link of this repo while navigated to your desired directory to copy this repo to your machine, run 'npm install' or 'npm i' in your command line in the root folder of this application to install dependencies required (mysql2, inquirer, console.table). (note: it is not recommended to update the version of these dependencies, in order to ensure maximum compatability)

  ## Usage
  1. To use your own mysql database with this program, edit the connection.js file to include your credentials. Alternatively, you can install the dotenv node package and create a .env file to store and protect your credentials. 
  2. In your command line while in the root folder of the application, login to the mysql shell using the command 'mysql -u root -p'. If you are using a different mysql user specify that in place of root. You'll insert your password after executing this command.
  3. Run the following commands to start with a fresh database:
    * 'SOURCE db/db.sql'
    * 'SOURCE db/schema.sql'
    * To start with seed data, run 'SOURCE db/seeds.sql'
  4. Exit the mysql shell using 'quit;' 
  5. While still in the application root folder, run the command 'npm start' to initiate the application.
  6. Follow the prompts on the screen to view and alter the employee database information as you'd like!

  ### Deployed link and Screenshots
  (no deployed application, runs through node on local machine)
  ![screenshot](./assets/images/employee-tracker.png)
  [walkthrough-video](https://drive.google.com/file/d/1wklsKUikLKTgV1ESNO4Mx7oAz3ziUr2Q/view?usp=sharing)

  ## Credits
  The user guidelines for this project were given by Trilogy Education as a part of the University of Kansas Full Stack Web Developer Bootcamp. © 2021 Trilogy Education Services, LLC, a 2U, Inc. brand. Code original to Brian Wilde.

  ## License
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
### MIT LICENSE

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

  ## Contributing
  No contributing guidelines currently

  ## Tests
  No tests at this time

  ## Questions
  You can find my GitHub profile at https://github.com/bgswilde
  For any further questions, reach out to me via email at bgswilde@gmail.com.
