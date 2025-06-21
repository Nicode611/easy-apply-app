from fastapi import FastAPI, Query
from jobspy import scrape_jobs
from typing import List
import logging
import pandas as pd
import numpy as np
import json

app = FastAPI()

def clean_data_for_json(data):
    """Nettoie les données pour les rendre compatibles JSON"""
    if isinstance(data, dict):
        return {k: clean_data_for_json(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [clean_data_for_json(item) for item in data]
    elif isinstance(data, (np.integer, np.floating)):
        if pd.isna(data) or np.isinf(data):
            return None
        return float(data) if isinstance(data, np.floating) else int(data)
    elif pd.isna(data):
        return None
    elif isinstance(data, str):
        return data.strip() if data else ""
    else:
        return data

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
    try:
        print(f"Recherche sur les sites: {site_name}")
        
        jobs = scrape_jobs(
            site_name=site_name,
            search_term=search_term,
            location=location,
            results_wanted=results_wanted,
            country_indeed=country_indeed,
            hours_old=hours_old,
            job_type=job_type,
            verbose=1,
        )
        
        print(f"Total de jobs trouvés: {len(jobs)}")
        if len(jobs) > 0:
            print(f"Sites dans les résultats: {jobs['site'].unique().tolist()}")
        
        # Sélectionner les colonnes et nettoyer les données
        selected_columns = ["title", "company", "location", "job_url", "site"]
        available_columns = [col for col in selected_columns if col in jobs.columns]
        
        if len(jobs) == 0:
            return []
        
        # Convertir en dictionnaire et nettoyer
        jobs_dict = jobs[available_columns].to_dict(orient="records")
        cleaned_jobs = clean_data_for_json(jobs_dict)
        
        return cleaned_jobs
        
    except Exception as e:
        print(f"Erreur lors de la recherche: {str(e)}")
        return [] 