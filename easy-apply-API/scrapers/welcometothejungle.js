/**
 * Scraper for Welcome to the Jungle job listings using Puppeteer.
 * - Navigates to a Welcome to the Jungle search page.
 * - Waits for job list to load.
 * - Extracts job title, company, location, and URL.
 * - Returns an array of job objects.
 */

// Import Puppeteer for headless browser automation
import puppeteer from 'puppeteer';

// Main asynchronous function to perform scraping
const scrapeWTTJ = async (jobQuery, locationQuery, customUrl = null, resultsWanted = 30) => {
  console.log(`========== Scraping Welcome To The Jungle ==========`);

  try {
    // Launch a headless browser instance
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    // Open a new page/tab in the browser
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36');

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

    // Manual wait to allow lazy-loaded content to render
    await new Promise(resolve => setTimeout(resolve, 2000));

    let jobs = [];
    let currentPage = 1;
    const maxPages = Math.ceil(resultsWanted / 20); // WTTJ affiche ~20 offres par page

    while (jobs.length < resultsWanted && currentPage <= maxPages) {
      console.log(`== WTTJ == Scraping page ${currentPage}`);
      
      // Auto-scroll to trigger lazy loading of job cards
      await page.evaluate(async () => {
        const distance = 200;
        const delay = ms => new Promise(r => setTimeout(r, ms));
        while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
          document.scrollingElement.scrollBy(0, distance);
          await delay(100);
        }
      });

      // Wait for the job listings container or timeout if none are present
      try {
        await page.waitForSelector('li[data-testid="search-results-list-item-wrapper"]', { timeout: 10000 });
      } catch (err) {
        console.log("== WTTJ == No results found");
        break;
      }

      // Debug: count matching job list items
      const itemCount = await page.$$eval(
        'li[data-testid="search-results-list-item-wrapper"]',
        els => els.length
      );

      // Extract job data
      try {
        const pageJobs = await page.evaluate(() => {
        // Execute code in the page context to extract job data
        const items = Array.from(document.querySelectorAll('li[data-testid="search-results-list-item-wrapper"]'));
        // Compute total items count for closure
        const itemCount = items.length;
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
          return { title, companyName, location, jobPostDate, url, image, companyLogo, jobWebsite: 'Welcome to the Jungle', itemCount };
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
            await new Promise(resolve => setTimeout(resolve, 2000));
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
    try { await browser.close(); } catch (_) {}
    throw err;
  }
};

// Export the scraper function for use in other modules
export default scrapeWTTJ;