var express = require('express');
var router = express.Router();
const MainController = require('../controllers/slider_controller'); 
const {asyncHandle} = require("../utils/asyncHandle")
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/',authMiddleware ,asyncHandle(MainController.createSlider));
router.put('/:id', authMiddleware ,asyncHandle(MainController.updateSlider));
router.delete('/:id', authMiddleware ,asyncHandle(MainController.deleteSlider));

router.get('/:id', asyncHandle(MainController.getSliderById));
router.get("/", MainController.getAll);

module.exports = router;