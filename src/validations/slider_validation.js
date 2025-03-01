const { body, param,validationResult } = require("express-validator");

const validateSlider = [
    param("id")
        .isMongoId().withMessage("ID không hợp lệ"),
    body("name")
        .notEmpty().withMessage("Tên không được để trống")
        .isLength({ min: 3, max: 100 }).withMessage("Tên phải có từ 3 đến 100 ký tự"),

    body("status")
        .optional()
        .isIn(["active", "inactive"]).withMessage("Trạng thái chỉ có thể là 'active' hoặc 'inactive'"),

    body("ordering")
        .optional()
        .isInt({ min: 0, max: 100 }).withMessage("Ordering phải là số từ 0 đến 100"),

    body("category_id")
        .notEmpty().withMessage("Category ID không được để trống")
        .isMongoId().withMessage("Category ID không hợp lệ"),

    body("imageUrl")
        .optional()
        .isURL().withMessage("Image URL phải là một đường dẫn hợp lệ"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Dữ liệu không hợp lệ",
                errors: errors.array().map(err => err.msg),
            });
        }
        next();
    }
];
const deleteSlider = [
    param("id")
        .isMongoId().withMessage("ID không hợp lệ"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Dữ liệu không hợp lệ",
                errors: errors.array().map(err => err.msg),
            });
        }
        next();
    }
];  

module.exports = {validateSlider, deleteSlider};
