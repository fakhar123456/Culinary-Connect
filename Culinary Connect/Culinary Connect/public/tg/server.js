const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = '';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const donationSchema = new mongoose.Schema({
  count: { type: Number, default: 0 }
});

const Donation = mongoose.model('Donation', donationSchema);


app.get('*', (req, res) => {
  res.sendFile(path.join(intialPath, "login.html"));
});

// Get donation counter
app.get('/api/donationCounter', async (req, res) => {
  try {
    let donation = await Donation.findOne();
    if (!donation) {
      donation = new Donation();
      await donation.save();
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update donation counter
app.post('/api/donationCounter', async (req, res) => {
  try {
    let donation = await Donation.findOne();
    if (!donation) {
      donation = new Donation();
    }
    donation.count += 1;
    await donation.save();
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});