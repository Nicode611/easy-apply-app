import express from 'express';
import scrapeHelloWork from './scrapers/hellowork.js';
import scrapeWTTJ from './scrapers/welcometothejungle.js';
import scrapeIndeed from './scrapers/indeed.js';
import cors from 'cors';

/**
 * Job scraper API using Express
 * Exposes endpoints to scrape HelloWork, Welcome to the Jungle, and Indeed.
 */


const app = express();
// Enable CORS for local Next.js apps on ports 3000 and 3002
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3002'] }));
const port = process.env.PORT || 3001;

// Endpoint to scrape HelloWork
// Usage: GET /api/hellowork?jobQuery=dev&locationQuery=remote&resultsWanted=30
app.get('/api/hellowork', async (req, res) => {
  try {
    const { jobQuery, locationQuery, resultsWanted } = req.query;
    const resultsCount = parseInt(resultsWanted);
    const jobs = await scrapeHelloWork(jobQuery, locationQuery, resultsCount);
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to scrape Welcome to the Jungle
// Usage: GET /api/wttj?jobQuery=dev&locationQuery=bordeaux&url=customUrl&resultsWanted=30
app.get('/api/wttj', async (req, res) => {
  try {
    const { jobQuery, locationQuery, url, resultsWanted } = req.query;
    const resultsCount = parseInt(resultsWanted) || 30;
    const jobs = await scrapeWTTJ(jobQuery, locationQuery, url || null, resultsCount);
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to scrape Indeed
// Usage: GET /api/indeed?jobQuery=dev&locationQuery=remote&resultsWanted=10
app.get('/api/indeed', async (req, res) => {
  try {
    const { jobQuery, locationQuery, resultsWanted } = req.query;
    const resultsCount = parseInt(resultsWanted) || 10;
    const jobs = await scrapeIndeed(jobQuery, locationQuery, resultsCount);
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    console.error("Error in Indeed endpoint:", err);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Endpoint to scrape all sources (HelloWork, WTTJ, and Indeed) in one request
// Usage: GET /api/all?jobQuery=dev&locationQuery=remote&url=customUrl&resultsWanted=30
app.get('/api/all', async (req, res) => {
  try {
    const { jobQuery, locationQuery, url, resultsWanted } = req.query;
    const resultsCount = parseInt(resultsWanted) || 30;
    
    // Fetch from HelloWork, WTTJ, and Indeed in parallel
    const [hwJobs, wttjJobs, indeedJobs] = await Promise.all([
      scrapeHelloWork(jobQuery, locationQuery, resultsCount),
      scrapeWTTJ(jobQuery, locationQuery, url || null, resultsCount),
      scrapeIndeed(jobQuery, locationQuery, resultsCount)
    ]);
    
    // Combine results
    const allJobs = [...hwJobs, ...wttjJobs, ...indeedJobs];
    res.json({ 
      count: allJobs.length, 
      helloWork: { count: hwJobs.length, jobs: hwJobs }, 
      wttj: { count: wttjJobs.length, jobs: wttjJobs }, 
      indeed: { count: indeedJobs.length, jobs: indeedJobs },
      all: allJobs 
    });
  } catch (err) {
    console.error("Error in /api/all endpoint:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Job scraper API listening at http://localhost:${port}`);
});