# wayfarer

[![Build Status](https://travis-ci.org/mustaphee/wayfarer.svg?branch=develop)](https://travis-ci.org/mustaphee/wayfarer)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ad906e84b989d2645139/test_coverage)](https://codeclimate.com/github/mustaphee/wayfarer/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/ad906e84b989d2645139/maintainability)](https://codeclimate.com/github/mustaphee/wayfarer/maintainability)

WayFarer is a public bus transportation booking server, built for ABL

## Features

### Users

- Signup and Login
- View all your trips
- Create a booking
- View all your bookings
- Filter your search by origin and destination

### Users

- Signup and Login
- Create a Trip
- View all trips
- Create a booking
- View all bookings
- Filter your search by origin and destination


## Installation

Clone repo to your local machine:

```git
git clone https://github.com/mustaphee/wayfarer.git
```

**Install dependencies and run locally**<br/>
*Note>> Install npm if not already installed on local machine*

Then run:

```yarn
npm install
```

Create .env like the .env.sample file, just replace with your own enviroment variables.

Now start the server:

```npm
yarn run db
npm run dev     /* Keep watching files for changes */
```

## Testing

To run tests:

```npm
npm run test       
```

## API

API is deployed at [here](https://my-wayfarer.herokuapp.com/) on heroku.
API documentation (POSTMAN)  is here [here](https://documenter.getpostman.com/view/4271685/SVSKMpAr/)

### API Routes

<table>
	<tr>
		<th>HTTP VERB</th>
		<th>ENDPOINT</th>
		<th>FUNCTIONALITY</th>
	</tr>
	<tr>
		<td>POST</td>
		<td>/api/v1/auth/signup</td> 
		<td>Create user account</td>
	</tr>
	<tr>
		<td>POST</td>
		<td>/api/v1/auth/signin</td> 
		<td>Sign in to user account</td>
	</tr>
	<tr>
		<td>POST</td>
		<td>/api/v1/trips</td> 
		<td>Create Trips</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/v1/trips</td> 
		<td>To view all trips</td>
	</tr>
	<tr>
		<td>PATCH</td>
		<td>/api/v1/trips/:tripId</td> 
		<td>Cancel a trip</td>
	</tr>
	<tr>
		<td>POST</td>
		<td>/api/v1/bookings</td> 
		<td>Book a seat</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/v1/bookings</td> 
		<td>View all booked seat</td>
	</tr>
	<tr>
		<td>DELETE</td>
		<td>/api/v1/bookings/:bookingId</td> 
		<td>Delete meal</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/v1/bookings/:origin</td> 
		<td>Filter bookings by origin</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/v1/bookings/:destinations</td> 
		<td>Filter bookings by destinations</td>
	</tr>
</table>  
