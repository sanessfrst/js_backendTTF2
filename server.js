const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');

const app = express();
const port = 8000;

app.use(express.json())
app.use(express.static('public'))

async function getDbCollection(dbAddress, dbName, dbCollection) {
	const client = new MongoClient(dbAddress);
	await client.connect();
	const db = client.db(dbName);
	return db.collection(dbCollection);
}

app.get('/titans', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1', 'titanbd', 'titans');
	const data = await collection.find({}).toArray();
	res.send(data);
})

app.get('/titans/:id', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1', 'titanbd', 'titans');
	const data = await collection.findOne({_id: new ObjectId(req.params.id)});
	res.send(data);
})

app.post('/titans', async function(req, res){
	const ttn = {...req.body, Status: true};
	const collection = await getDbCollection('mongodb://127.0.0.1', 'titanbd', 'titans');
	await collection.insertOne(ttn);
	res.send(ttn);
})

app.patch('/titans/:id', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1', 'titanbd', 'titans');
	const data = await collection.updateOne({_id: new ObjectId(req.params.id)}, {'$set':  req.body});
	res.send({});
})

app.delete('/titans/:id', async function(req, res){
	console.log(req.params.id);
	const collection = await getDbCollection('mongodb://127.0.0.1', 'titanbd', 'titans');
	const data = await collection.deleteOne({_id: new ObjectId(req.params.id)});
	res.send({});
})

app.listen(port, function() {
	console.log('Server is started!')
});