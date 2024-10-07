import { console } from "inspector";
import foodModel from "../models/foodModel.js";
import fs from 'fs';

// Add food items
const addFood = async (req, res) => {
    try {
        let image_filename = `${req.file.filename}`;
        const { name, description, price, category } = req.body;

        const food = new foodModel({
            name: name,
            description: description,
            price: price,
            category: category,
            image: image_filename
        })
        await food.save();
        res.json({
            success: true,
            message: "Food Added",
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Error",
            error
        })
    }
};

//all food list

const listFood = async(req,res)=>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true, data:foods});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//remove food item

const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({successs:true, message:"Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

export { addFood,listFood,removeFood };
