# SF Movie Locator

## Installation

```bash
$ npm install
```
## Run (localhost:3000)

```bash
$ npm start
```

## Summary:
 * SF Movie is a single-page web application that allows users to search if movies are made in SF 
 and where they were made at, by director name or movie name
 * Check out the app live: [SF Movie Locator]
 
## Technology Stack:

### Backend:

#### Node/Express/Heroku (Little Experience)
I used a Node.js web application server framework, Express.js as the backend. Given the time constraint and estimated complexity of this project, I chose a relatively fast-to-learn framework and light-weight framework. I also have heard express is the most popular Node.js based framework and has a lot of features and supports available.

For database, I did not actually used a database. Given that the dataset is relatively small, I used a javascript script to parse the data and precomputed the (longitutde, latitude) of each location using [Google Geocoder node module](https://www.npmjs.com/package/geocoder). I stored these data in the memory so that it provides fast read speed. 

sf-movie.json is the original json file downloaded from [DataSF](http://www.datasf.org/): [Film
Locations](https://data.sfgov.org/Arts-Culture-and-Recreation-/Film-Locations-in-San-Francisco/yitu-d5am) and [geo-calc.js](https://github.com/gyx119/sf-movies/blob/master/geo-calc.js) is where the cleaning and getting (longitutde, latitude) and finally [formatted.json](https://github.com/gyx119/sf-movies/blob/master/formatted.json) is the final data.

The application was deployed onto Heroku. Heroku has very smooth integration with express and deploy literally takes only a few seconds!

#### HandleBars, Bootstrap, JQuery (Medium Experience)
I used handleBars as the templating engine because i have been working with it before i like its powerfuly functionality and big supporting community. For styling, Bootstrap provides a lot UI elements, such as the dropdown, toggle and input field i have used. Finally, JQuery comes handy when i need to do some DOM manipulation, such as removing markers, switch between searchs, hide elements, etc.

[sf_movies.js](https://github.com/gyx119/sf-movies/blob/master/public/javascripts/sf_movie.js) is the customized javascript file to define different user interation on the main page. [index.hbs](https://github.com/gyx119/sf-movies/blob/master/views/index.hbs) is the main page for the application. [index.js](https://github.com/gyx119/sf-movies/blob/master/routes/index.js) contains two public api, one for search director name and one for search movie name.

###Testing 
#### Mocha.js, SuperTest (No previous experience)
I used [mocha](https://mochajs.org/) and [supertest](https://www.npmjs.com/package/supertest) to unit-test the public API (search by director & movie name).

## Challenges:
#### Learning Curve
 To learn different technology stacks in a short amount of time and getting support
#### Database
In the beginning I had some issue with the rate limiter for Google Map API. I had to try couples times and set different timeout to make sure I do not exceed the API rate limit.

I was also evaluating pros and cons between setting up a database and storing the data in moemory and also how does that change the way to implement auto complete. Given the size of dataset, and the fast read speed if it resides in memory, and the complexity, I decided to store the formatted json data file in memory.

#### Autocomplete
Given the decision of storing dataset in memory, I implement autocomplete using search through the database and used JQuery's index of api to match the prefix. I had some concerns about the performance in the beginning, since if it takes too long, user can just type it without waiting for the autoocomplete to show up. However, when i test this locally, it was surpringly fast (~5ms/query). After deploying to Heroku, the speed was around ~100ms, which is around the typeahead threshold according to my research. 

## Next Step (Things to improve on):
#### Testing
* I have explored Mocha and supertest for unit test and have written tests for the public API (search director & movie name). Given the time constraints, I was not able to do some front-end test as well as automation end-to-end test. 

#### Database
* Build a database (MySQL) that supports fast searching through indexing. Right now it takes O(n) (using prefix matching) (would make sense if the data set gets bigger or if we want to extend this projects to other cities as well)
* The current solution does not automatically update the data. Given the data does not change frequently, in the future we could have it fetch from the source once a day
* I also noticed when manual testing, some location is null and some data cleaning would be ideal
* It would also improve performance if we leverage Redis to cache the search result in memory

#### Core Functionality
* It would be cool if we can request an Uber on the application and actually take us to the location where the movie was made
* Also would be nice if we can see more information about the movie, when we click the marker on the map, such as a link to imdb

   [SF Movie Locator]: <https://sf-movie-locator.herokuapp.com>
