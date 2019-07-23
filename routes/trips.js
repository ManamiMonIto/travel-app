const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");

//Get Trips
router.get("/", (req, res) => {

  Trip.find()
    .populate("activity")
    .populate("owner")
    .then(trip => {
      res.json(trip);
    })
    .catch(error => {
      res.json(error);
    });
});

//Get one trip
router.get("/:id", (req, res) => {
  const id = req.params.id;

  Trip.findById(id)
    .populate("activity")    
    .populate("owner")
    .then(trip => {
      res.json(trip);
    })
    .catch(error => {
      res.json(error);
    });
});

//Create Trip
router.post("/", (req, res) => {
  const { budget, title, description, startDate, endDate } = req.body;

  Trip.create({
    budget,
    title,
    description,
    startDate,
    endDate
  })
    .then(trip => {
      res.json(trip);
    })
    .catch(err => {
      res.json(err);
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { budget, title, description, startDate, endDate } = req.body;

  Trip.findByIdAndUpdate(id, { 
      budget,
      title,
      description,
      startDate,
      endDate 
    })
    .then(() => {
      res.json({ message: `Trip with id ${id} was successfully updated` });
    })
    .catch(err => {
      res.json(err);
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Trip.findByIdAndDelete(id)
    .then(() => {
      res.json({ message: `Trip with id ${id} was successfully deleted` });
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;


//Activity   post id:trip  date:name 