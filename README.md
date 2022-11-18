# Periodic Tables: Restaurant Reservation Application

## Introduction
Periodic Tables is a restaurant reservation booking and table management system. Users of this application can view, create, edit, and delete reservations. Users can also search for reservations via mobile-number. Users can create new tables and seat reservations at a specific table. When seating the reservation at a table, validation will occur to ensure that the table size is of capable capacity for the reservation.

#
## Active Example
* Vercel.com(fronend): <hidden>https://restaurant-reservation-app-omega.vercel.app/dashboard
* Render.com(backend): <hidden>https://thebackendofallbackends.onrender.com
* Github Code: https://github.com/ZleoZack/Restaurant-Reservation-App

## Technologies used
_Back end:_
1. Node
1. Express
1. Knex
1. PostgreSQL
1. Jest

_Font end:_
1. React (hooks, router, icons, etc...)
1. Bootstrap
1. e2e tests

| Route | Method |  Description |
| ----- | ------ |  ----------- |
| `/reservations` | POST| creates and returns a new reservation |
| `/reservations?date='YYYY-MM-DD'`| GET | returns reservations by date (sorted asc) |
| `/reservations?mobile_number=123` |GET | returns reservations by partial match of phone number |
| `/reservations/:reservationId` |GET| returns reservation matching the reservationId |
| `/reservations/:reservationId` |PUT| updates and returns the reservation matching the reservationId |
| `/reservations/:reservationId/status` |PUT | updates only the status of a reservation |
| `/tables` |GET | returns all Tables |
| `/tables` |POST| creates and returns a new table |
| `/tables:table_id/seat` |PUT| updates a table with a reservation Id and changes status to "occupied" |
| `/tables:table_id/seat` |DELETE | updates a table by deleting reservation Id and changes status to "free" |

<br />

## Features

### Create Reservation
You can create a reservation in the next way. First you can create a new reservation by clicking on the `+ New Reservation` at the top of the page. Each reservation requires a first name, last name, mobile number, party size, reservation time, and reservation date.
> Errors will be thrown if one of the following were to occur: Invalid mobile number length, any of the fields are empty, date of reservation must be placed for the future, and the reservation time must be valid as well being between the restaurant operating hours.

<br />

![Create Reservation](/png/CreateReservation.jpg)
![Error Example](/png/ErrorExample.jpg)
### Edit Reservation
You can edit any of the reservations that have not been seated by clicking on the `Edit` button found at the bottom of each reservation card. Clicking the edit button will redirect the user to an edit reservation page which will allow the user to edit any of the customer information. 

<br />

![Edit Reservation](/png/EditReservation.jpg)


### Cancel Reservation
User has the ability to cancel any reservation that has been created and yet to be seated. Clicking on the `Cancel` button at the bottom of each reservation card will generate a Window Confirmation dialog box and will be asking the user to confirm the cancellation. 

![Cancel Reservation](/png/CancelReservation.jpg)

### Seat Reservation
To seat a reservation, simply click on the `Seat` button, this will redirect the user to a new page where the user can view the reservation party size. It will also display to the user a dropdown table which will list all of the tables and the table's max seating. 

>If the party size is too big for the selected table, an error will notify the user that the selected table is too small.

![Seat Reservation](/png/SeatCapacity.jpg)

<br />

### Example of a seated table
![Seated Table](/png/SeatTable.jpg)

### Search Reservation
At the top of the navbar is a link to a search bar. When user clicks on the link it will redirect them to the search bar where the user can input any mobile number and will lookup to see if that mobile number has been used for a reservation. It will also show the status of the mobile number as either `Seated`, `Booked`, `Cancelled`, or `Finished`.

![Search](/png/Search.jpg)

### Example of search listing
![Search List](/png/SearchList.jpg)


### Create Table
User can click on the top of the page with the `New Table` button. It will redirect the user to the New Table page which allows the user to create a new table name and the seating capacity. 

![Create Table](/png/CreateNewTable.jpg)

## Database setup
1. Set up four new ElephantSQL database instances - development, test, preview, and production - by following the instructions in this [article](https://medium.com/@noogetz/how-to-setup-a-database-with-elephantsql-7d87ea9953d0).
2. After setting up your database instances, connect DBeaver to your new database instances by following the Official Documenation [Here](https://dbeaver.com/docs/wiki/Create-Connection/).

### Knex 
Run `npx knex` commands from within the `back-end` folder, which is where the `knexfile.js` file is located. 

### Installation <a name="installation">
1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env`.
3. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
4. Run `cp ./front-end/.env.sample ./front-end/.env`.
5. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
6. Run `npm install` to install project dependencies.
7. Run `npm run start:dev` to start your server in development mode.

## Running tests
This project has unit, integration, and end-to-end (e2e) tests. 
End-to-end tests use browser automation to interact with the application just like the user does.
