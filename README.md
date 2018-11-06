[![Build Status](https://travis-ci.com/Wiredpanda/phoenix-apis.svg?branch=master)](https://travis-ci.com/Wiredpanda/phoenix-apis)

#Documentation


# Bet
1. User submits a bet
1. Fetch all my bets
1. Fetch all bets on a video
1. Issue out winning
1. Tie mechanics
1. Other…

# Notifications
Will not be triggered by a API call

# Event Logger
1. POST - /event - Save an event
1. GET - /event/list - Fetch all the events - Some searching
1. No deleting

# CI
https://travis-ci.org/Wiredpanda/phoenix-apis

# Schedule Hooks
1. Every 5 minutes run and lock contests within X minutes from ending.
# General Hooks
1. On complete game issue out the winnings


# General Flow
Place the user flow designs here.  Outline how the FE works with the BE to do specific things


# To Do
## Admin Tool
1. Create contest CMS
1. Provide credits 
1. Provide winnings.
1. Enter play by play
1. ACLs
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
