# Project 4 - Cards Against Humanities
WDIR Project 4 - Soniya, An, Biren

## Live Site
http://humanity-app-frontend.herokuapp.com/

## Technologies Used
- HTML
- CSS
- JavaScript (Node.js and jQuery)
- AngularJS
- PostgreSQL
- Express.js
- Bcrypt
- Express-session
- Body-parser
- JSON
- Ruby on Rails


## Approach Taken
A four-model, full-stack application with Rails backend serving JSON API with full CRUD operations approach was taken for developing this online version of Cards Against Humanities.  Both frontend and backend are hosted on Heroku.  CORS was configured so that only the intended frontend app can alter the database and anyone can read data from the hosted API.  A many-to-many relationship was created between black and white cards (through the scores model).  The development team used Github and Zenhub for version control and tracking the development of game features.

## Unsolved Problems
None.

## Notes/Planned Features
- Multiplayer Game
- Responsive Design for mobile users
- Options to upload different Cards Against Humanities JSON libraries
- Options to modify scores
