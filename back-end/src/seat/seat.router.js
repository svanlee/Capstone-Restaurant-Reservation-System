const router = require("express").Router({ mergeParams: true });
const controller = require("./seat.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");


//singular router route here allowing for us to update information utilizing express

router
.route("/")
.put(controller.update)
.delete(controller.unassign)
.all(methodNotAllowed);


module.exports = router;