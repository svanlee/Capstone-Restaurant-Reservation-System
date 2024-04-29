const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

const COMPLETED_RESERVATION_FIELDS = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function _validateTime(string) {
  const [hour, minute] = string.split(":");

  if (hour.length > 2 || minute.length > 2) {
    return false;
  }
  if (hour < 0 || hour > 23) {
    return false;
  }
  if (minute < 0 || minute > 59) {
    return false;
  }
  return true;
}

function isValidReservation(req, res, next) {
  const reservation = req.body.data;

  if (!reservation) {
    return next({ status: 400, message: `Must have data property.` });
  }

  COMPLETED_RESERVATION_FIELDS.forEach((input) => {
    if (!reservation[input]) {
      return next({ status: 400, message: `${input} field required` });
    }

    if (input === "people" && typeof reservation[input] !== "number") {
      return next({
        status: 400,
        message: `${reservation[input]} is not a number type for people field.`,
      });
    }

    if (input === "reservation_date" && !Date.parse(reservation[input])) {
      return next({ status: 400, message: `${input} is not a valid date.` });
    }

    if (input === "reservation_time") {
      if (!_validateTime(reservation[input])) {
        return next({ status: 400, message: `${input} is not a valid time` });
      }

      const [hour, minute] = reservation[input].split(":");
      const inputDate = new Date();
      inputDate.setHours(hour, minute, 0);

      if (inputDate < new Date()) {
        return next({ status: 400, message: `${input} must be in the future` });
      }
    }
  });

  next();
}

function isNotOnTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const [year, month, day] = reservation_date.split("-");
  const date = new Date(`${month} ${day}, ${year}`);
  res.locals.date = date;
  if (date.getDay() === 2) {
    return next({ status: 400, message: "Location is closed on Tuesdays" });
  }
  next();
}

function isInTheFuture(req, res, next) {
  const date = res.locals.date;
  const today = new Date();
  if (date < today) {
    return next({ status: 400, message: "Must be a future date" });
  }
  next();
}

function isWithinOpenHours(req, res, next) {
  const reservation = req.body.data;
  const [hour, minute] = reservation.reservation_time.split(":");
  if (hour < 10 || hour > 21) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  if ((hour < 11 && minute < 30) || (hour > 20 && minute > 30)) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  next();
}

function hasBookedStatus(req, res, next) {
  const { status } = res.locals.reservation
    ? res.locals.reservation
    : req.body.data;
  if (status === "seated" || status === "finished" || status === "cancelled") {
    return next({
      status: 400,
      message: `New reservation can not have ${status} status.`,
    });
  }
  next();
}

function isValidStatus(req, res, next) {
  const VALID_STATII = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  if (!VALID_STATII.includes(status)) {
    return next({ status: 400, message: "Status unknown." });
  }
  next();
}

function isAlreadyFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: "Cannot change a reservation with a finished status.",
    });
  }
  next();
}

const reservationExists = async (req, res, next) => {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation_id ${reservation_id} does not exist.`,
  });
};

async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations;
  if (mobile_number) {
    reservations = await service.search(mobile_number);
  } else {
    reservations = date ? await service.listByDay(date) : await service.list();
  }
  res.json({
    data: reservations,
  });
}

async function create(req, res) {
  const reservation = req.body.data;
  const { reservation_id } = await service.create(reservation);
  reservation.reservation_id = reservation_id;
  res.status(201).json({ data: reservation });
}

async function read(req, res) {
  const reservation = res.locals.reservation;
  res.json({ data: reservation });
}

async function update(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;
  const reservation = await service.update(reservation_id, status);
  res.json({ data: reservation });
}

async function modify(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = req.body.data;

  if (
    !reservation.reservation_date ||
    !reservation.reservation_time ||
    !reservation.people
  ) {
    return next({
      status: 400,
      message: "Must include reservation_date, reservation_time, and people fields",
    });
  }

  const [hour, minute] = reservation.reservation_time.split(":");
  const inputDate = new Date();
  inputDate.setHours(hour, minute, 0);

  if (inputDate < new Date()) {
    return next({ status: 400, message: `${inputDate} must be in the future` });
  }

  if (reservation.people <= 0) {
    return next({
      status: 400,
      message: "People field must be a positive integer",
    });
  }

  const data = await service.modify(reservation_id, reservation);
  reservation.reservation_id = data.reservation_id;
  res.json({ data: reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(isValidReservation),
    isNotOnTuesday,
    isInTheFuture,
    isWithinOpenHours,
    hasBookedStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    isValidStatus,
    isAlreadyFinished,
    asyncErrorBoundary(update),
  ],
  modify: [
    asyncErrorBoundary(isValidReservation),
    isNotOnTuesday,
    isInTheFuture,
    isWithinOpenHours,
    asyncErrorBoundary(reservationExists),
    hasBookedStatus,
    asyncErrorBoundary(modify),
  ],
};
