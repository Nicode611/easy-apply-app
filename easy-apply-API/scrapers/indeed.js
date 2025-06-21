/**
 * Scraper for Indeed job listings using API call.
 * - Makes an API call to the Indeed jobs endpoint.
 * - Extracts job data from the API response.
 * - Returns an array of job objects.
 */

// Main asynchronous function to perform API call
const scrapeIndeed = async (jobQuery, locationQuery, resultsWanted = 10) => {
  console.log(`========== Scraping Indeed ==========`);

  try {
    
    // Build the API URL with query parameters
    const apiUrl = `http://127.0.0.1:8000/jobs?search_term=${encodeURIComponent(jobQuery)}&location=${encodeURIComponent(locationQuery)}&results_wanted=${resultsWanted}`;
    console.log(`== API == Making API call to: ${apiUrl}`);

    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`== API == call failed with status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();
    /* console.log("Jobs from API :", data); */
    console.log(`== API == ${data.length || 0} jobs found`);

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
      jobWebsite: job.site || '',
      description: job.description || job.job_description || '',
      salary: job.salary || '',
    })) : [];

    return jobs.filter(job => job.title); // Filter out jobs without titles

  } catch (err) {
    console.error("== API == Error in scrapeIndeed:", err);
    throw err;
  }
};

// Export the scraper function for use in other modules
export default scrapeIndeed;
