var express = require('express');
var router = express.Router();
const MainController = require('../controllers/slider_controller'); 
const {validateSlider, deleteSlider} = require("../validations/slider_validation");

// router.post("/update-ordering/:id", MainController.updateOrdering);
// router.post("/update-status/:id", validateSlider,MainController.updateStatus);

router.get('/:id', MainController.getSliderById);
router.post('/', validateSlider ,MainController.createSlider);
router.put('/:id', validateSlider,MainController.updateSlider);
router.delete('/:id', deleteSlider,MainController.deleteSlider);

router.get("/", MainController.getAll);

module.exports = router;