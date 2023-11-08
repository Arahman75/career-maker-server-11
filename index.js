const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
const corsConfig = {
    origin: [
        'http://localhost:5173',
        'https://pet-sitting-and-walking.web.app',
        'https://pet-sitting-and-walking.firebaseapp.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig));
// app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ik9fyhp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// vercel link: https://b8a11-career-maker-server.vercel.app

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const serviceCollection = client.db('petsDB').collection('services');
        const bookingCollection = client.db('petsDB').collection('booking');

        //post service
        app.post('/services', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await serviceCollection.insertOne(newProduct);
            res.send(result)
        })

        // get all services
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        // get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('update id', id);
            const query = { _id: new ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })

        // handle delete
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })


        // post booking
        app.post('/booking', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await bookingCollection.insertOne(newProduct);
            res.send(result)
        })

        // get data similar email
        app.get('/booking', async (req, res) => {
            // console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            console.log('update id', id);
            const query = { _id: new ObjectId(id) };
            const result = await bookingCollection.findOne(query);
            res.send(result)
        })

        // app.patch('/bookings/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) }
        //     const updateBooking = req.body;
        //     console.log(updateBooking);
        //     const updateDoc = {
        //         $set: {
        //             status: updateBooking.status
        //         },
        //     };
        //     const result = await bookingCollection.updateOne(filter, updateDoc);
        //     res.send(result)
        // })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Pets server is running!')
})

app.listen(port, () => {
    console.log(`Pets service is running on port ${port}`)
})