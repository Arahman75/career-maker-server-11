const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000

// middleware 
app.use(express.json());
app.use(cors());

// pass : kqIAhn6Rsv8nb7RY
// user: petsWalking
console.log(process.env.DB_PASS);
console.log(process.env.DB_USER);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ik9fyhp.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri, 'hello secret');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const serviceCollection = client.db('petsDB').collection('services');

        //post service

        app.post('/services', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        })

        // app.get('/products', async (req, res) => {
        //     const cursor = productCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result)
        // })


        // app.delete('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const result = await productCollection.deleteOne(query);
        //     res.send(result)
        // })

        // app.get('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log('update id', id);
        //     const query = { _id: new ObjectId(id) };
        //     const result = await productCollection.findOne(query);
        //     res.send(result)
        // })

        // app.put('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateProduct = req.body;
        //     const product = {
        //         $set: {
        //             name: updateProduct.name,
        //             brandName: updateProduct.brandName,
        //             price: updateProduct.price,
        //             description: updateProduct.description,
        //             rating: updateProduct.rating, image: updateProduct.image
        //         }
        //     }
        //     const result = await productCollection.updateOne(filter, product, options);
        //     res.send(result)
        // })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})