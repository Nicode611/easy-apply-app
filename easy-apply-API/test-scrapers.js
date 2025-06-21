import scrapeHelloWork from './scrapers/hellowork.js';
import scrapeWTTJ from './scrapers/welcometothejungle.js';
import scrapeIndeed from './scrapers/indeed.js';

const testScrapers = async () => {
  const searchTerm = 'développeur';
  const location = 'Paris';
  const resultsWanted = 50; // Test avec 50 offres

  console.log(`=== Test des scrapers avec ${resultsWanted} offres demandées ===`);
  console.log(`Terme de recherche: ${searchTerm}`);
  console.log(`Localisation: ${location}`);

  try {
    console.log("\n=== Test HelloWork ===");
    const hwJobs = await scrapeHelloWork(searchTerm, location, resultsWanted);
    console.log(`HelloWork: ${hwJobs.length} offres trouvées`);

    console.log("\n=== Test Welcome to the Jungle ===");
    const wttjJobs = await scrapeWTTJ(searchTerm, location, null, resultsWanted);
    console.log(`Welcome to the Jungle: ${wttjJobs.length} offres trouvées`);

    console.log("\n=== Test Indeed ===");
    const indeedJobs = await scrapeIndeed(searchTerm, location, resultsWanted);
    console.log(`Indeed: ${indeedJobs.length} offres trouvées`);

    console.log("\n=== Résumé ===");
    console.log(`Total: ${hwJobs.length + wttjJobs.length + indeedJobs.length} offres`);
    console.log(`- HelloWork: ${hwJobs.length}`);
    console.log(`- Welcome to the Jungle: ${wttjJobs.length}`);
    console.log(`- Indeed: ${indeedJobs.length}`);

    // Vérification
    if (hwJobs.length > 30) {
      console.log("✅ HelloWork: Plus de 30 offres trouvées");
    } else {
      console.log("❌ HelloWork: Moins de 30 offres trouvées");
    }

    if (wttjJobs.length > 30) {
      console.log("✅ Welcome to the Jungle: Plus de 30 offres trouvées");
    } else {
      console.log("❌ Welcome to the Jungle: Moins de 30 offres trouvées");
    }

    if (indeedJobs.length > 30) {
      console.log("✅ Indeed: Plus de 30 offres trouvées");
    } else {
      console.log("❌ Indeed: Moins de 30 offres trouvées");
    }

  } catch (error) {
    console.error("Erreur lors du test:", error);
  }
};

testScrapers(); 