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
    console.error("Error in HelloWork endpoint:", err.message);
    // Return empty results instead of 500 error
    res.json({ count: 0, jobs: [], error: "HelloWork temporarily unavailable" });
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
    console.error("Error in WTTJ endpoint:", err.message);
    // Return empty results instead of 500 error
    res.json({ count: 0, jobs: [], error: "Welcome to the Jungle temporarily unavailable" });
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
    console.error("Error in Indeed endpoint:", err.message);
    // Return empty results instead of 500 error
    res.json({ count: 0, jobs: [], error: "Indeed temporarily unavailable" });
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
    
    // Fetch from HelloWork, WTTJ, and Indeed in parallel with individual error handling
    const results = await Promise.allSettled([
      scrapeHelloWork(jobQuery, locationQuery, resultsCount),
      scrapeWTTJ(jobQuery, locationQuery, url || null, resultsCount),
      scrapeIndeed(jobQuery, locationQuery, resultsCount)
    ]);
    
    // Extract results and handle individual failures
    const hwJobs = results[0].status === 'fulfilled' ? results[0].value : [];
    const wttjJobs = results[1].status === 'fulfilled' ? results[1].value : [];
    const indeedJobs = results[2].status === 'fulfilled' ? results[2].value : [];
    
    // Log any failures
    if (results[0].status === 'rejected') {
      console.error("HelloWork scraping failed:", results[0].reason);
    }
    if (results[1].status === 'rejected') {
      console.error("WTTJ scraping failed:", results[1].reason);
    }
    if (results[2].status === 'rejected') {
      console.error("Indeed scraping failed:", results[2].reason);
    }
    
    // Combine results
    const allJobs = [...hwJobs, ...wttjJobs, ...indeedJobs];
    res.json({ 
      count: allJobs.length, 
      helloWork: { count: hwJobs.length, jobs: hwJobs }, 
      wttj: { count: wttjJobs.length, jobs: wttjJobs }, 
      indeed: { count: indeedJobs.length, jobs: indeedJobs },
      all: allJobs,
      errors: {
        helloWork: results[0].status === 'rejected' ? "HelloWork temporarily unavailable" : null,
        wttj: results[1].status === 'rejected' ? "Welcome to the Jungle temporarily unavailable" : null,
        indeed: results[2].status === 'rejected' ? "Indeed temporarily unavailable" : null
      }
    });
  } catch (err) {
    console.error("Error in /api/all endpoint:", err.message);
    // Return empty results instead of 500 error
    res.json({ 
      count: 0, 
      helloWork: { count: 0, jobs: [] }, 
      wttj: { count: 0, jobs: [] }, 
      indeed: { count: 0, jobs: [] },
      all: [],
      errors: {
        helloWork: "HelloWork temporarily unavailable",
        wttj: "Welcome to the Jungle temporarily unavailable", 
        indeed: "Indeed temporarily unavailable"
      }
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Job scraper API listening at http://localhost:${port}`);
});