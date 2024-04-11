// server.js
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Connect to MongoDB database
const MongoDB = async () => {
	try {
		const connc = await mongoose.connect(
			'mongodb+srv://hardikkhandal:hardik@cluster0.bzmmk52.mongodb.net/?retryWrites=true&w=majority'
		);

		console.log(`MongoDB connected: ${connc.connection.host}`);
	} catch (error) {
		console.log(error.message);
		process.exit();
	}
};

// Define a mongoose schema for the form data
const FormDataSchema = new mongoose.Schema({
	companyName: { type: String },
	amount: { type: Number },
	description: { type: String }
});

// Create a mongoose model based on the schema
const FormData = mongoose.model('FormData', FormDataSchema);

// Middleware to parse request body
app.use(bodyParser.json());
app.use(cors());

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
