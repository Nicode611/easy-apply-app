/**
 * Scraper for HelloWork job listings using Puppeteer.
 * - Navigates to a HelloWork search page.
 * - Waits for job list to load.
 * - Extracts job title, company, location, and type.
 * - Returns an array of job objects.
 */

// Import Puppeteer for headless browser automation
import puppeteer from 'puppeteer';

// Main asynchronous function to perform scraping
const scrapeHelloWork = async (jobQuery, locationQuery, resultsWanted = 60) => {
  console.log("========== Scraping hellowork ==========");

  try {
    // Launch a headless browser instance
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Open a new page/tab in the browser
    const page = await browser.newPage();
    // Prevent navigation timeouts
    await page.setDefaultNavigationTimeout(60000);

    // Build the HelloWork search URL from parameters
    const url = `https://www.hellowork.com/fr-fr/emploi/recherche.html?k=${encodeURIComponent(jobQuery)}${locationQuery ? `&l=${encodeURIComponent(locationQuery)}` : ''}`;
    console.log(`== HelloWork == Searching with URL: ${url}`);
    console.log(`== HelloWork == Results wanted: ${resultsWanted}`);

    // Navigate to the HelloWork search URL and wait until network is idle
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the job listings container or timeout if none are present
    try {
      await page.waitForSelector('ul[aria-label="liste des offres"]', { timeout: 5000 });
    } catch (err) {
      console.log("== HelloWork == No results found");
      await browser.close();
      return [];
    }

    let jobs = [];
    let currentPage = 1;
    const maxPages = Math.ceil(resultsWanted / 20); // HelloWork affiche ~20 offres par page

    while (jobs.length < resultsWanted && currentPage <= maxPages) {
      console.log(`== HelloWork == Scraping page ${currentPage}`);
      
      try {
        const pageJobs = await page.evaluate(() => {
          // Execute code in the page context to extract job data

          // Select all job entry <li> elements within the listings <ul>
          const items = Array.from(document.querySelectorAll('ul[aria-label="liste des offres"] li'));

          // Map over each job element to build a structured object
          const results = items.map(job => {
            const titleAnchor = job.querySelector('a');
            
            // Extract the main job image (background image) - first direct img child of header
            const imageEl = job.querySelector('header > img'); 
            const image = imageEl?.src.trim() || '';
            
            // Extract company logo from the <img> inside a <div> within header
            const companyLogoEl = job.querySelector('header div img');
            const companyLogo = companyLogoEl?.src.trim() || '';
            
            const url = titleAnchor?.href.trim() || '';
            const title = titleAnchor?.innerText.trim() || '';
            const companyImg = job.querySelector('img');
            const companyName = companyImg?.alt.trim() || '';
            // Extract location from the localisationCard element
            const locationEl = job.querySelector('div[data-cy="localisationCard"]');
            const location = locationEl ? locationEl.textContent.trim() : '';

            // Extract full post date text only if it starts with "il y a"
            const postDateEls = Array.from(job.querySelectorAll('div.tw-typo-s.tw-text-grey'));
            const postDateEl = postDateEls.find(el => el.innerText.trim().toLowerCase().startsWith('il y a'));
            const jobPostDate = postDateEl ? postDateEl.innerText.trim() : '';

            // Fallback for extracting the type label
            const textNodes = Array.from(job.childNodes)
              .filter(n => n.nodeType === Node.TEXT_NODE)
              .map(n => n.textContent.trim())
              .filter(t => t);
            const [, type] = textNodes;
            return { title, companyName, location, jobPostDate, type, url, image, companyLogo, jobWebsite: 'HelloWork' };
          });
          return results.filter(j => j.title);
        });
        
        jobs = jobs.concat(pageJobs);
        console.log(`== HelloWork == Page ${currentPage}: ${pageJobs.length} jobs found, total: ${jobs.length}`);
        
        // Check if we need to go to next page
        if (jobs.length < resultsWanted && currentPage < maxPages) {
          // Try to click on next page button
          const nextButton = await page.$('button[aria-label="Page suivante"]');
          if (nextButton) {
            await nextButton.click();
            await page.waitForTimeout(2000); // Wait for page to load
            currentPage++;
          } else {
            console.log("== HelloWork == No more pages available");
            break;
          }
        } else {
          break;
        }
        
      } catch (evalErr) {
        console.error("== HelloWork == Error during page.evaluate:", evalErr);
        break;
      }
    }

    // Limit results to requested amount
    jobs = jobs.slice(0, resultsWanted);
    console.log(`== HelloWork == Final result: ${jobs.length} jobs found`);

    console.log("== HelloWork == Finished scraping, closing browser");
    // Close the browser to free resources
    await browser.close();
    return jobs;
  } catch (err) {
    console.error("== HelloWork == Error in scrapeHelloWork:", err);
    // Ensure browser is closed on error
    try { await browser.close(); } catch (closeErr) { console.error("Error closing browser after failure:", closeErr); }
    throw err;
  }
};

// Export the scraper function for use in other modules
export default scrapeHelloWork;