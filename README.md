# Online Pictionary Game

An online pictionary app I made. [Play now!](https://socket-pictionary.herokuapp.com/)

Local installation instructions:
```
git clone https://github.com/mattlub/socket-pictionary.git && cd socket-pictionary
npm install
npm start
```

### Current status
- it works

### Current notes, for full version

What to store:
- current players
- game state
- game phase

New player 'journey':
- name entry
- add to players list
- load game
  - load chatroom
  - straight into game

Game phase:
- artist selection
- pre-drawing (is this needed?)
- mid-drawing
- post-drawing (announcement of result)

### TODO
- testing: tape, frontend
- style
- modularise much more
- add list of current players

### improvements?
- error handling
- render functions should be more uniform
