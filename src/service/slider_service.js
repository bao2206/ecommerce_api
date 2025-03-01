const SliderModel = require('../models/slider_model');
class SliderService {
    async getAll ({page, limit, name, status})  {
        let query={};
        if(name) query.name = name;
        if(status !== "all") query.status = status;
        const sliders = await SliderModel.find(query).skip((page - 1) * limit).limit(limit).sort({ordering: 1});
        const total = await SliderModel.countDocuments(query); 
        let totalPage = Math.ceil(total / limit);   
        return {
            data: sliders,
            total,
            page, 
            totalPage: totalPage
        };
    }
    async createSlider(data) {
        try {
            const newSlider = new SliderModel(data);
            await newSlider.save();
            return { success: true, data: newSlider };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    async updateSlider(id, data) {
        try {
            const updatedSlider = await SliderModel.findByIdAndUpdate(id, data, { new: true });

            if (!updatedSlider) {
                return { success: false, message: "Không tìm thấy slider" };
            }

            return { success: true, data: updatedSlider };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    async findById(id){
        const slider = await SliderModel.findById(id);
        if (!slider) {
            return { success: false, message: "Không tìm thấy slider" };
        }
        return {success: true, message: "Tìm slider thành công" };
    }
    async findByIdAndDelete(id){
        const slider = await SliderModel.findById(id);
        if (!slider) {
            return { success: false, message: "Không tìm thấy slider" };
        }
        await SliderModel.findByIdAndDelete(id);
        return {success: true, message: "Xoá slider thành công" };
    }
}

module.exports = new SliderService();