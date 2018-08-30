# Account
1. POST  /account - create account
1. GET /account - Get specific account
1. GET /account/list - Get all accounts
1. DELETE /account/:accountId - Delete account
1. PATCH - /account/:accountId - Update the account

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
1. POST - /notification/email/EMAIL_NOTIFICATION_ID
1. POST - /notification/push/PUSH_NOTIFICATION_ID

# Event Logger
1. POST - /event - Save an event
1. GET - /event/list - Fetch all the events - Some searching
1. No deleting

# Contest
1. POST - /contest - Create a new contest
1. GET - /contest/:contestId - Get specific contest
1. GET - /contest/:type/list - Get all the contests in the system for a specific type.
1. PATCH - /contest/:contestId - Update specific contest

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
## Registration
1. Create account + Create Wallet + Email + Hook up with Strype
## Login 
1. Account
## Contests
1. Contests List
## Contest
1. Contest
## Betting
1. Betting
## Disbursement
1. Betting
1. Wallet
## Notifications
1. Send out notification to users. 

# To Do
1. Set up Travis
1. Set up Infra (AWS Lambda, ec2 with mongos, elastic cache redis, api gateway)
1. DB - Mongo -> DynamoDB
1. Cache - Redis
1. Tech - NodeJS -> Go
1. Change out to GraphQL
1. Integrate SAM
