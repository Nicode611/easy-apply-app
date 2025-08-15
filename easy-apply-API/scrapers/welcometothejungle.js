/**
 * Scraper for Welcome to the Jungle job listings using Puppeteer.
 * - Navigates to a Welcome to the Jungle search page.
 * - Waits for job list to load.
 * - Extracts job title, company, location, and URL.
 * - Returns an array of job objects.
 * - Falls back to JobSpy API if direct scraping fails.
 */

// Import Puppeteer for headless browser automation
import puppeteer from 'puppeteer';

// Main asynchronous function to perform scraping
const scrapeWTTJ = async (jobQuery, locationQuery, customUrl = null, resultsWanted = 30) => {
  console.log(`========== Scraping Welcome To The Jungle ==========`);

  let browser;
  try {
    // Launch a headless browser instance
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    // Open a new page/tab in the browser
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set additional headers to appear more like a real browser
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    });

    // Determine which URL to use: custom or constructed
    const url = customUrl
      ? customUrl
      : `https://www.welcometothejungle.com/fr/jobs?query=${encodeURIComponent(jobQuery)}&page=1` +
        `${locationQuery ? `&aroundQuery=${encodeURIComponent(locationQuery)}` : ''}` +
        `&refinementList%5Boffices.country_code%5D%5B%5D=FR` +
        `&aroundLatLng=44.84044%2C-0.5805` +
        `&aroundRadius=20`;
    console.log(`== WTTJ == Searching with URL: ${url}`);
    console.log(`== WTTJ == Results wanted: ${resultsWanted}`);

    // Navigate to the WTTJ search URL and wait until network is idle
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the page to be fully loaded
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 10000 });

    // Manual wait to allow lazy-loaded content to render
    await new Promise(resolve => setTimeout(resolve, 8000));

    let jobs = [];
    let currentPage = 1;
    const maxPages = Math.ceil(resultsWanted / 20); // WTTJ affiche ~20 offres par page

    while (jobs.length < resultsWanted && currentPage <= maxPages) {
      console.log(`== WTTJ == Scraping page ${currentPage}`);
      
      // Wait for the page to be ready before any evaluation
      await page.waitForFunction(() => document.readyState === 'complete', { timeout: 10000 });
      
      // Auto-scroll to trigger lazy loading of job cards
      try {
        await page.evaluate(async () => {
          const distance = 200;
          const delay = ms => new Promise(r => setTimeout(r, ms));
          while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
            document.scrollingElement.scrollBy(0, distance);
            await delay(100);
          }
        });
      } catch (scrollError) {
        console.log("== WTTJ == Scroll error, continuing...", scrollError.message);
      }

      // Wait for job listings to load
      try {
        await page.waitForSelector('li[data-testid="search-results-list-item-wrapper"]', { timeout: 10000 });
      } catch (err) {
        console.log("== WTTJ == No results found with direct scraping, trying JobSpy API...");
        
        // Close browser and try JobSpy API as fallback
        await browser.close();
        return await scrapeWTTJWithJobSpy(jobQuery, locationQuery, resultsWanted);
      }

      // Extract job data
      try {
        const pageJobs = await page.$$eval('li[data-testid="search-results-list-item-wrapper"]', (items) => {
          // Map over each job element to build a structured object
          const results = items.map(job => {
            const anchor = job.querySelector('a');
            const imgEl = anchor?.querySelector('img');
            const image = imgEl?.src.trim() || '';
            const companyLogoEl = job.querySelector('div > img');
            const companyLogo = companyLogoEl?.src.trim() || '';
            const title = job.querySelector('h4')?.innerText.trim() || '';
            const companyName = job.querySelector('span.wui-text')?.innerText.trim() || '';
            const location = job.querySelector('p.wui-text')?.innerText.trim() || '';
            const url = anchor?.href.trim() || '';
            // Extract the relative post time from the <span> inside <time>
            const spanEl = job.querySelector('time[datetime] > span');
            const jobPostDate = spanEl ? spanEl.innerText.trim() : '';
            
            return { title, companyName, location, jobPostDate, url, image, companyLogo, jobWebsite: 'Welcome to the Jungle' };
          });
          return results.filter(j => j.title);
        });
        
        jobs = jobs.concat(pageJobs);
        console.log(`== WTTJ == Page ${currentPage}: ${pageJobs.length} jobs found, total: ${jobs.length}`);
        
        // Check if we need to go to next page
        if (jobs.length < resultsWanted && currentPage < maxPages) {
          // Try to navigate to next page by updating URL
          const nextPageUrl = url.replace(/&page=\d+/, `&page=${currentPage + 1}`);
          if (nextPageUrl !== url) {
            await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
            await page.waitForFunction(() => document.readyState === 'complete', { timeout: 10000 });
            await new Promise(resolve => setTimeout(resolve, 3000));
            currentPage++;
          } else {
            console.log("== WTTJ == No more pages available");
            break;
          }
        } else {
          break;
        }
        
      } catch (evalErr) {
        console.error("== WTTJ == Error during page.evaluate:", evalErr);
        break;
      }
    }

    // Limit results to requested amount
    jobs = jobs.slice(0, resultsWanted);
    console.log(`== WTTJ == Final result: ${jobs.length} jobs found`);

    console.log("== WTTJ == Finished scraping, closing browser");
    // Close the browser to free resources
    await browser.close();
    return jobs;
  } catch (err) {
    console.error("== WTTJ == Error in scrapeWTTJ:", err);
    if (browser) {
      try { 
        await browser.close(); 
      } catch (closeError) {
        console.error("== WTTJ == Error closing browser:", closeError);
      }
    }
    
    // Try JobSpy API as fallback
    console.log("== WTTJ == Trying JobSpy API as fallback...");
    return await scrapeWTTJWithJobSpy(jobQuery, locationQuery, resultsWanted);
  }
};

// Fallback function using JobSpy API
const scrapeWTTJWithJobSpy = async (jobQuery, locationQuery, resultsWanted = 30) => {
  console.log(`== WTTJ == Using JobSpy API fallback`);
  
  try {
    // Build the API URL with query parameters
    const apiUrl = `http://127.0.0.1:8000/jobs?search_term=${encodeURIComponent(jobQuery)}&location=${encodeURIComponent(locationQuery)}&results_wanted=${resultsWanted}`;
    console.log(`== WTTJ == Making API call to: ${apiUrl}`);

    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`== WTTJ == API call failed with status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log(`== WTTJ == ${data.length || 0} jobs found via API`);

    // Transform the API response to match the expected job format
    const jobs = Array.isArray(data) ? data.map(job => ({
      title: job.title || job.job_title || '',
      companyName: job.company || job.company_name || '',
      location: job.location || '',
      jobPostDate: job.post_date || job.date_posted || '',
      type: job.type || job.job_type || '',
      url: job.url || job.job_url || '',
      image: job.image || job.company_logo || '',
      companyLogo: job.company_logo || job.logo || '',
      jobWebsite: job.site || 'Welcome to the Jungle',
      description: job.description || job.job_description || '',
      salary: job.salary || '',
    })) : [];

    return jobs.filter(job => job.title); // Filter out jobs without titles

  } catch (err) {
    console.error("== WTTJ == Error in JobSpy API fallback:", err);
    throw err;
  }
};

// Export the scraper function for use in other modules
export default scrapeWTTJ;