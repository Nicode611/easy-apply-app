import { Job } from "@/types/job"

interface ExternalApiResponse {
  all: Job[];
}

// Request GET to get all the plants from a user id
export const getAllJobs = async (jobQuery: string, locationQuery: string, resultsWanted: number = 30): Promise<Job[]> => {
    try {
        // Get jobs from external API
        const response = await fetch(`/api/jobs/external?job=${jobQuery}&location=${locationQuery}&resultsWanted=${resultsWanted}`);
        const data: ExternalApiResponse = await response.json();

        // Get saved jobs from our API
        const savedJobsResponse = await fetch('/api/jobs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const savedJobs: Job[] = await savedJobsResponse.json();

        // Merge the states from saved jobs into the external jobs
        const jobsWithStates = data.all.map((job: Job) => {
            const savedJob = savedJobs.find((saved: Job) => saved.url === job.url);
            if (savedJob) {
                return {
                    ...job,
                    savedState: savedJob.savedState,
                    savedDate: savedJob.savedDate,
                    appliedState: savedJob.appliedState,
                    appliedDate: savedJob.appliedDate
                };
            }
            return {
                ...job,
                savedState: null,
                savedDate: null,
                appliedState: null,
                appliedDate: null
            };
        });

        return jobsWithStates;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

// Request Get to get Jobs from hellowork
export const getJobsFromHellowork = async (jobQuery: string, locationQuery: string, resultsWanted: number = 30): Promise<Job[]> => {
    try {
        const response = await fetch(`/api/jobs/hellowork?job=${jobQuery}&location=${locationQuery}&resultsWanted=${resultsWanted}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ExternalApiResponse = await response.json();
        
        // Get saved jobs from our API to check states
        const savedJobsResponse = await fetch('/api/jobs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const savedJobs: Job[] = await savedJobsResponse.json();

        // Merge the states from saved jobs into the external jobs
        const jobsWithStates = data.all.map((job: Job) => {
            const savedJob = savedJobs.find((saved: Job) => saved.url === job.url);
            if (savedJob) {
                return {
                    ...job,
                    savedState: savedJob.savedState,
                    savedDate: savedJob.savedDate,
                    appliedState: savedJob.appliedState,
                    appliedDate: savedJob.appliedDate
                };
            }
            return {
                ...job,
                savedState: null,
                savedDate: null,
                appliedState: null,
                appliedDate: null
            };
        });

        return jobsWithStates;
    } catch (error) {
        console.error('Error fetching HelloWork jobs:', error);
        return [];
    }
};

// Request Get to get Jobs from welcometothejungle
export const getJobsFromWelcometothejungle = async (jobQuery: string, locationQuery: string, resultsWanted: number = 30): Promise<Job[]> => {
    try {
        const response = await fetch(`/api/jobs/welcometothejungle?job=${jobQuery}&location=${locationQuery}&resultsWanted=${resultsWanted}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ExternalApiResponse = await response.json();
        
        // Get saved jobs from our API to check states
        const savedJobsResponse = await fetch('/api/jobs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const savedJobs: Job[] = await savedJobsResponse.json();

        // Merge the states from saved jobs into the external jobs
        const jobsWithStates = data.all.map((job: Job) => {
            const savedJob = savedJobs.find((saved: Job) => saved.url === job.url);
            if (savedJob) {
                return {
                    ...job,
                    savedState: savedJob.savedState,
                    savedDate: savedJob.savedDate,
                    appliedState: savedJob.appliedState,
                    appliedDate: savedJob.appliedDate
                };
            }
            return {
                ...job,
                savedState: null,
                savedDate: null,
                appliedState: null,
                appliedDate: null
            };
        });

        return jobsWithStates;
    } catch (error) {
        console.error('Error fetching Welcome to the Jungle jobs:', error);
        return [];
    }
};

// Request Get to get Jobs from indeed
export const getJobsFromIndeed = async (jobQuery: string, locationQuery: string, resultsWanted: number = 30): Promise<Job[]> => {
    try {
        const response = await fetch(`/api/jobs/indeed?job=${jobQuery}&location=${locationQuery}&resultsWanted=${resultsWanted}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ExternalApiResponse = await response.json();
        
        // Get saved jobs from our API to check states
        const savedJobsResponse = await fetch('/api/jobs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const savedJobs: Job[] = await savedJobsResponse.json();

        // Merge the states from saved jobs into the external jobs
        const jobsWithStates = data.all.map((job: Job) => {
            const savedJob = savedJobs.find((saved: Job) => saved.url === job.url);
            if (savedJob) {
                return {
                    ...job,
                    savedState: savedJob.savedState,
                    savedDate: savedJob.savedDate,
                    appliedState: savedJob.appliedState,
                    appliedDate: savedJob.appliedDate
                };
            }
            return {
                ...job,
                savedState: null,
                savedDate: null,
                appliedState: null,
                appliedDate: null
            };
        });

        return jobsWithStates;
    } catch (error) {
        console.error('Error fetching Indeed jobs:', error);
        return [];
    }
};