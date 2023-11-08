
// import mongoose, { model } from "mongoose";

const { default: mongoose } = require("mongoose");

const uri = 'mongodb://127.0.0.1/shop';

mongoose.connect(uri);

const data2={
        name: 'Laptop ProMax',
        company: '64c23350e32f4a51b19b9231',
        price: 3999,
        colors: [ '#333333', '#cccccc', '#00ff00' ],
        image: '/images/product-laptop.png',
        category: '64c2342de32f4a51b19b924e',
        isFeatured: true,
}

const data3 = {
        name: 'Laptop UltraProMax',
        company: '64c23350e32f4a51b19b9231',
        price: 4999,
        colors: [ '#333333', '#cccccc', '#00ff00' ],
        image: '/images/product-laptop.png',
        category: '64c2342de32f4a51b19b924e',
        isFeatured: true,
}

const productSchema = new mongoose.Schema({
    name: String,
    company: String,
    price: Number,
    colors: [ String ],
    image: String,
    category: String,
    isFeatured: Boolean,
})

const Products =new mongoose.model("Products", productSchema);

const main = async () => {
    try {
        // insert
        // await Products.insertMany(data2,data3);
        // update
        // await Products.findOneAndUpdate(
        //     {name:"Laptop ProMax", price:3999},
        //     {$set:{name:"Laptop Pro1", price:2999}}
        // )
        // delete
        // await Products.findOneAndDelete(
        //     {name:"Laptop Pro", price:2999}
        // )
        const data = await Products.find({price:{$eq:2999}});
        console.log(data);
    } catch (error) {
        console.log(error);
    } finally{
        mongoose.connection.close();
    }
}
main();