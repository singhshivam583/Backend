// import  MongoClient  from "mongodb";
const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1";

const client = new MongoClient(uri);

const data1= {
    name: 'Laptop Pro',
    company: '64c23350e32f4a51b19b9231',
    price: 2999,
    colors: [ '#333333', '#cccccc', '#00ff00' ],
    image: '/images/product-laptop.png',
    category: '64c2342de32f4a51b19b924e',
    isFeatured: true,
}

const main = async () => {
    await client.connect();
    const db = client.db("shop");
    const collection = db.collection("products");
    await collection.insertOne(data1);
    const data = await collection.find({ price: { $gt: 1200 } }).toArray();
    console.log(data);
    return "done";
}
main()
    .then(console.log())
    .catch((e )  => console.log(e))
    .finally(() => client.close());


    // await MongoClient.connect(uri);
