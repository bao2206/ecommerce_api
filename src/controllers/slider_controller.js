const SliderService = require("../service/slider_service");
const { BadRequestError, ErrorCustom } = require("../core/errorCustom");
const mongoose = require("mongoose");
class slider_controller {
  async getAll(req, res, next) {
    let { page = 1, limit = 10, name = "", status = "all" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const sliders = await SliderService.getAll({ page, limit, name, status });
    res.status(200).json({
      message: "Lấy danh sách slider thành công",
      data: sliders,
    });
  }

  async createSlider(req, res, next) {
    const { name } = req.body;
    const checkName = await SliderService.checkNameExist(name);
    if (checkName) throw Error("Tên slider đã tồn tại");

    res.status(201).json({
      message: "Tạo slider thành công",
      data: await SliderService.createSlider(req.body),
    });
  }

  async updateSlider(req, res, next) {
    const { id } = req.params;
    const { name } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("ID không tồn tại");
    }

    const sliderId = await SliderService.findSliderById(id);
    if (!sliderId) throw new BadRequestError("Slider không tồn tại");

    let sliderName = await SliderService.checkNameExitNotId(id, name);
    if (sliderName) throw Error("Slider da ton tai name");

    res.status(200).json({
      message: "Cập nhật slider thành công",
      data: await SliderService.updateSlider(id, req.body),
    });
  }
  async getSliderById(req, res, next) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("ID không tồn tại");
    }
    const slider = await SliderService.findSliderById(id);
    
    if (!slider) throw new BadRequestError("Slider không tồn tại");
    res.status(200).json({
      message: "Lấy slider thành công",
      data: slider,
    });
  }
  async deleteSlider(req, res, next) {
    const { id } = req.params;
    const slider = await SliderService.findSliderById(id);
    if (!slider) throw new BadRequestError("Slider không tồn tại");
    return res.status(200).json({ 
      message: "Xoá slider thành công" ,
      data: await SliderService.findByIdAndDelete(id)
    });
  }
  // responseJson(res, number, message, data) {
  //   res.status(number).json({
  //     message: message,
  //     data: data,
  //   });
  // }
}

module.exports = new slider_controller();
