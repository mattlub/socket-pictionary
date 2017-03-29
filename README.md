# Online Pictionary Game

An ambitious online pictionary app.

Local installation instructions: (to be amended)
```
git clone && cd
npm install
npm start
```

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
  - wait if in progress

Game phase:
- artist selection
- pre-drawing
- mid-drawing
- post-drawing

### Most basic functionality

- require nickname
- then chat loads immediately (and is permanent)
- pick a player every 30s, and load canvas/game
- so may have to wait up to 30s for a new game

### TODO
- testing: tape, frontend
- modularise much more
- get basic functionality

### improvements?
- error handling
- render functions should be more uniform
