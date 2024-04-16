import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// Connect to MongoDB database
const MongoDB = async () => {
	try {
		const connc = await mongoose.connect(
			'mongodb+srv://hardikkhandal:hardik@cluster0.bzmmk52.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
		);

		console.log(`MongoDB connected: ${connc.connection.host}`);
	} catch (error) {
		console.log(error.message);
		process.exit(1); // Exit the process with error
	}
};

// Listen for MongoDB connection events
mongoose.connection.on('connected', () => {
	console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
	console.error(`MongoDB connection error: ${err}`);
	process.exit(1); // Exit the process with error
});

mongoose.connection.on('disconnected', () => {
	console.log('MongoDB disconnected');
});

// Call MongoDB function to connect to the database
MongoDB();

// Define a mongoose schema for the form data
const FormDataSchema = new mongoose.Schema({
	companyName: { type: String },
	amount: { type: Number },
	description: { type: String }
});

// Create a mongoose model based on the schema
const FormData = mongoose.model('FormData', FormDataSchema);

// Middleware to parse request body
// Endpoint to handle form submissions
app.post('/api/submit-form', async (req, res) => {
	try {
		// Extract form data from request body
		const { companyName, amount, description } = req.body;
		console.log(companyName);
		// Create a new document using the FormData model
		const formData = new FormData({ companyName, amount, description });

		// Save the form data to the database
		await formData.save();

		// Respond with success message
		res.json({ message: 'Form submitted successfully' });
	} catch (error) {
		// Log the error for debugging
		console.error('Error submitting form:', error);
		// Respond with error message
		res.status(500).json({ error: error.message }); // Send error message in response
	}
});

// Endpoint to fetch form data
app.get('/api/get-form-data', async (req, res) => {
	try {
		const formDataEntries = await FormData.find({});
		res.json(formDataEntries);
	} catch (error) {
		console.error('Error fetching form data:', error);
		res.status(500).json({ error: 'Failed to fetch form data' });
	}
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

// Endpoint to handle fetching form data

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

process.on('SIGINT', async () => {
	await mongoose.connection.close();
	console.log('MongoDB connection closed');
	process.exit(0);
});
