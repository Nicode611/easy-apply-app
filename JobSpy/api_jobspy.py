from fastapi import FastAPI, Query
from jobspy import scrape_jobs
from typing import List
import logging

app = FastAPI()

@app.get("/jobs")
def get_jobs(
    site_name: List[str] = Query(["indeed", "linkedin", "glassdoor"]),
    search_term: str = Query("developpeur"),
    location: str = Query("Pau"),
    results_wanted: int = Query(50),
    country_indeed: str = Query("France"),
    hours_old: int = Query(None),
    job_type: str = Query(None),
):
    print(f"Recherche sur les sites: {site_name}")
    
    jobs = scrape_jobs(
        site_name=site_name,
        search_term=search_term,
        location=location,
        results_wanted=results_wanted,
        country_indeed=country_indeed,
        hours_old=hours_old,
        job_type=job_type,
        verbose=1,  # Augmenter la verbosité pour voir les logs
    )
    
    print(f"Total de jobs trouvés: {len(jobs)}")
    if len(jobs) > 0:
        print(f"Sites dans les résultats: {jobs['site'].unique()}")
    
    # On retourne les colonnes demandées (titre, entreprise, localisation, url, site)
    return jobs[["title", "company", "location", "job_url", "site"]].to_dict(orient="records") 