/**
 * LinkedIn public job scraper (no login)
 * Scrape job titles, companies, locations, and links from the public search page
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const scrapeLinkedIn = async (jobQuery, locationQuery) => {
  try {
    console.log('🔗 Scraping LinkedIn public jobs...');
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
    });

    // Build LinkedIn jobs search URL
    const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobQuery)}&location=${encodeURIComponent(locationQuery)}`;
    console.log('🌐 Navigating to:', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Extract jobs
    const jobs = await page.evaluate(() => {
      console.log('DEBUG: Recherche des éléments de liste...');
      
      // Essayer plusieurs sélecteurs
      const selectors = [
        '.scaffold-layout__list li',
        '.jobs-search__results-list li',
        '.jobs-search-results__list li',
        '.search-results__list li',
        'li[data-occludable-job-id]',
        '.job-search-card'
      ];
      
      let items = [];
      let usedSelector = '';
      
      for (const selector of selectors) {
        items = Array.from(document.querySelectorAll(selector));
        console.log(`DEBUG: Sélecteur "${selector}" - ${items.length} éléments trouvés`);
        if (items.length > 0) {
          usedSelector = selector;
          break;
        }
      }
      
      console.log('DEBUG: Sélecteur utilisé:', usedSelector);
      console.log('DEBUG: Nombre total d\'éléments:', items.length);
      
      if (items.length === 0) {
        console.log('DEBUG: Aucun élément trouvé. Classes disponibles:');
        const allElements = document.querySelectorAll('*');
        const classes = new Set();
        allElements.forEach(el => {
          if (el.className) {
            el.className.split(' ').forEach(cls => classes.add(cls));
          }
        });
        console.log('DEBUG: Classes trouvées:', Array.from(classes).slice(0, 20));
        
        // Afficher la structure HTML
        const mainContent = document.querySelector('main') || document.querySelector('.jobs-search-results') || document.body;
        console.log('DEBUG: Structure HTML (premiers 2000 caractères):', mainContent.innerHTML.slice(0, 2000));
      }
      
      return items.map(item => {
        console.log('DEBUG: Traitement d\'un élément:', item.outerHTML.slice(0, 200));
        
        const titleEl = item.querySelector('h3') || item.querySelector('.base-search-card__title') || item.querySelector('[data-testid="job-card-title"]');
        const companyEl = item.querySelector('h4') || item.querySelector('.base-search-card__subtitle') || item.querySelector('[data-testid="job-card-company"]');
        const locationEl = item.querySelector('.job-search-card__location') || item.querySelector('[data-testid="job-card-location"]');
        const linkEl = item.querySelector('a.base-card__full-link') || item.querySelector('a[href*="/jobs/view/"]');
        
        const job = {
          title: titleEl ? titleEl.innerText.trim() : '',
          companyName: companyEl ? companyEl.innerText.trim() : '',
          location: locationEl ? locationEl.innerText.trim() : '',
          jobPostDate: '',
          type: '',
          url: linkEl ? linkEl.href : '',
          image: '',
          companyLogo: '',
          jobWebsite: 'LinkedIn'
        };
        
        console.log('DEBUG: Job extrait:', job);
        return job;
      }).filter(j => j.title && j.companyName && j.url);
    });
    await browser.close();
    console.log(`📊 LinkedIn: ${jobs.length} jobs found`);
    return jobs;
  } catch (error) {
    console.error('❌ Error scraping LinkedIn:', error);
    return [];
  }
};

export default scrapeLinkedIn; 