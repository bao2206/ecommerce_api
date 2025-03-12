const SliderModel = require('../models/slider_model');
const { coverIdToObjectId }  = require('../utils/helper')
const returnData = (status, value) => {
    return {
        success: status,
        data: value 
    }
 }
class SliderService {
    async getAll ({page, limit, name, status})  {
        const query = {
            ...(name && { name }),
            ...(status !== "all" && { status })
        };
    
        const [sliders, total] = await Promise.all([
            SliderModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ ordering: 1 })
                .select('-__v')
                .lean(),  // Sử dụng lean() để trả về plain object, nhanh hơn document của mongoose
            SliderModel.countDocuments(query)
        ]);
    
        return {
            data: sliders,
            total,
            page, 
            totalPage: Math.ceil(total / limit),
            success: true
        };
    }
    async createSlider({
        name,
        status,
        ordering,
        category_id,
        imageUrl
    }){
        let newSlider = await SliderModel.create({
            name,
            status,
            ordering,
            category_id,
            imageUrl
        });
        // return {
        //     success: true,
        //     data: newSlider
        // }
        returnData(true, newSlider);
    }
    async checkNameExist(name){
        return await SliderModel.findOne({name});  
    }
    async checkNameExitNotId(id, name){
        return await SliderModel.findOne({name, _id: {$ne: coverIdToObjectId(id)}});
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
    async findSliderById(id){
        return await SliderModel.findById(id);
    }
    async findByIdAndDelete(id){
        await SliderModel.findByIdAndDelete(id);
        return {
            success: true,
            data: 1
        };
    }
}

module.exports = new SliderService();