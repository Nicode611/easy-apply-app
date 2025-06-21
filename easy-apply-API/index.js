import scrapeHelloWork from './scrapers/hellowork.js';
import scrapeWTTJ from './scrapers/welcometothejungle.js';
import scrapeIndeed from './scrapers/indeed.js';

const main = async () => {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const searchTerm = args[0] || 'python'; // Default search term
  const location = args[1] || 'Paris'; // Default location
  const resultsWanted = parseInt(args[2]) || 10; // Default number of results
  const customWTTJUrl = args[3] || null; // Custom WTTJ URL (optional)

  console.log(`=== Job Scraping with parameters ===`);
  console.log(`Search term: ${searchTerm}`);
  console.log(`Location: ${location}`);
  console.log(`Results wanted: ${resultsWanted}`);

  console.log("\n=== HelloWork Scraping ===");
  const hwJobs = await scrapeHelloWork(searchTerm, location);
  console.log(`HelloWork jobs: ${hwJobs.length}`);

  console.log("\n=== Welcome to the Jungle Scraping ===");
  if (customWTTJUrl) {
    console.log(`Using custom WTTJ URL: ${customWTTJUrl}`);
  }
  const wttjJobs = await scrapeWTTJ(searchTerm, location, customWTTJUrl);
  console.log(`WTTJ jobs: ${wttjJobs.length}`);

  console.log("\n=== Indeed Scraping ===");
  const indeedJobs = await scrapeIndeed(searchTerm, location, resultsWanted);
  console.log(`Indeed jobs: ${indeedJobs.length}`);

  // Summary
  console.log("\n=== Summary ===");
  console.log(`Total jobs found: ${hwJobs.length + wttjJobs.length + indeedJobs.length}`);
  console.log(`- HelloWork: ${hwJobs.length}`);
  console.log(`- Welcome to the Jungle: ${wttjJobs.length}`);
  console.log(`- Indeed: ${indeedJobs.length}`);
};

main().catch(console.error);