const SliderService = require("../service/slider_service");
const mongoose = require("mongoose");
class slider_controller {
  async getAll(req, res, next) {
    try {
      let { page = 1, limit = 10, name = "", status = "all" } = req.query;

      page = parseInt(page);
      limit = parseInt(limit);

      const sliders = await SliderService.getAll({ page, limit, name, status });
      res.status(200).json(sliders);
    } catch (error) {
      console.log(error);
    }
  }

  async createSlider(req, res, next) {
    try {
      const result = await SliderService.createSlider(req.body);
      if (!result.success) {
        return res
          .status(500)
          .json({ message: "Lỗi khi tạo slider", error: result.message });
      }

      res.status(201).json({
        message: "Slider đã được tạo thành công",
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  }

  async updateSlider(req, res, next) {
    try {
      const { id } = req.params;
      const result = await SliderService.updateSlider(id, req.body);

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({
        message: "Slider đã được cập nhật thành công",
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  }
  async getSliderById(req, res, next) {
    const { id } = req.params;
    const slider = await SliderService.findById(id);
    if (!slider) {
      return res.status(404).json({ message: "Không tìm thấy slider" });
    }
    return res.status(200).json(slider);
  }
  async deleteSlider(req, res, next) {
    const { id } = req.params;
    const slider = await SliderService.findById(id);
    if (!slider) {
      return res.status(404).json({ message: "Không tìm thấy slider" });
    }
    await SliderService.findByIdAndDelete(id);
    return res.status(200).json({ message: "Xoá slider thành công" });
  }
}

module.exports = new slider_controller();
