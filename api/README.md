# Smart Pump API

## Geting Started

To set up and run this project, it only takes two bash commands:

1. <code>npm install</code> to get the dependencies installed

2. <code>npm start</code> to start up the express server on localhost:5000

There are only 2 npm scripts I made for this :
- test
- start

Test uses Chai, Mocha and Supertest. If you find test doesn't close, just use CRTL + C (CMD + C for MacOS)

## API Routes

- /api/login 

- /api/register

- /api/user/:userId

- /api/user/:userId/edit/\<data to edit key \>

- /api/user/:userId/logout

And a testing-only route:
- /api/admin/:userId/edit/balance

The explanation of what these routes require and send can be found in the comments in index.js