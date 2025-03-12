var express = require('express');
var router = express.Router();
const MainController = require('../controllers/slider_controller'); 
const {asyncHandle} = require("../utils/asyncHandle")

router.get('/:id', asyncHandle(MainController.getSliderById));
router.post('/' ,asyncHandle(MainController.createSlider));
router.put('/:id', asyncHandle(MainController.updateSlider));
router.delete('/:id', asyncHandle(MainController.deleteSlider));

router.get("/", MainController.getAll);

module.exports = router;