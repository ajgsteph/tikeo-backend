import 'dotenv/config';
import { Logging } from '@google-cloud/logging';

async function testGCPConnection() {
  console.log('Testing GCP Logging connection...\n');

  try {
    const logging = new Logging({
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.KEYFILENAME,
    });

    // Liste les logs existants
    const [logs] = await logging.getLogs();

    console.log('✅ Connexion réussie à Google Cloud Logging!');
    console.log(`Project ID: ${process.env.PROJECT_ID}`);
    console.log(`Logs existants: ${logs.length}`);

    if (logs.length > 0) {
      console.log('\nPremiers logs:');
      logs.slice(0, 5).forEach((log) => {
        console.log(`  - ${log.name}`);
      });
    }
  } catch (error: any) {
    console.error('❌ Erreur de connexion à GCP:');
    console.error(error.message);

    if (error.code === 'ENOENT') {
      console.error("\n⚠️  Le fichier de credentials n'existe pas");
      console.error(`Chemin: ${process.env.KEYFILENAME}`);
    } else if (error.code === 7) {
      console.error('\n⚠️  Permissions insuffisantes ou projet invalide');
      console.error('Vérifie que le service account a le rôle "Logs Writer"');
    }
  }
}

testGCPConnection();
