# Account
## POST  /account - create account
**Params:**

**Response:**


1. GET /account - Get specific account
1. GET /account/list - Get all accounts
1. DELETE /account/:accountId - Delete account
1. PATCH - /account/:accountId - Update the account

# Authentication
## POST -  Login - Log the user in
**Params:**
1. email  - Email Address of account to log into.
1. password - Password of account to log into.

**Response:**

`{
    "token": "JWT HERE"
}`

## POST -  Log out
**Params:**
None

**Required Headers**
1. Authorization - "Bearer JWT_HERE"

**Response:**

`{}`


# Wallet 
1. POST /wallet - Create a new wallet
1. GET /wallet/:walletId - Fetch a specific wallet
1. DELETE /wallet/:walletId - Soft delete a wallet
1. PATCH /wallet/:walletId - update the wallet

# Bet
1. User submits a bet
1. Fetch all my bets
1. Fetch all bets on a video
1. Issue out winning
1. Tie mechanics
1. Other…

# Notification
Will not be triggered by a API call

# Event Logger
1. POST - /event - Save an event
1. GET - /event/list - Fetch all the events - Some searching
1. No deleting

# Contest
1. POST - /contest - Create a new contest
1. GET - /contest/:contestId - Get specific contest
1. GET - /contest/:type/list - Get all the contests in the system for a specific type.
1. PATCH - /contest/:contestId - Update specific contest

# CI
https://travis-ci.org/Wiredpanda/phoenix-apis

# Schedule Hooks
1. Every 5 minutes run and lock contests within X minutes from ending.
# General Hooks
1. On complete game issue out the winnings

# Admin Tool
1. Create contest CMS
1. Provide credits 
1. Provide winnings.
1. Enter play by play
1. ACLs

# General Flow
Place the user flow designs here

# To Do
1. Unit Tests
1. Integration Tests
1. Notifications Service
1. Event Logger
1. Stripe integration
1. Set up Travis
1. Set up Infra (AWS Lambda, ec2 with mongos, elastic cache redis, api gateway)
1. DB - Mongo -> DynamoDB
1. Cache - Redis
1. Tech - NodeJS -> Go
1. Change out to GraphQL
1. Integrate SAM
