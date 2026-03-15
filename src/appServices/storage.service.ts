import { Storage } from '@google-cloud/storage';
import { logger } from '../shared/logger/logger.service';

const keyFileName = process.env.KEYFILENAME;
const projectId = process.env.PROJECT_ID;
const bucketName = process.env.BUCKET_NAME;

if (!keyFileName || !projectId || !bucketName) {
  throw new Error('Erreur de stockage du fichier sur google le env est imcomplet ');
}

const storage = new Storage({
  keyFilename: keyFileName,
  projectId: projectId,
});

const bucket = storage.bucket(bucketName);

export const uploadToGCS = async (
  fileBuffer: Buffer,
  filename: string,
  mimetype: string,
): Promise<string> => {
  try {
    const newFilename = `${Date.now()}-${filename}`;
    const blob = bucket.file(newFilename);

    // ici je Vérifie si le fichier existe déjà (avec le nouveau nom que j'ai creer )
    const [exists] = await blob.exists();
    if (exists) {
      logger.log(`Ce fichier ${newFilename} existe déjà, suppression...`);
      await deleteFromGCS(newFilename);
    }

    await blob.save(fileBuffer, {
      contentType: mimetype,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${newFilename}`;
    return publicUrl;
  } catch (error) {
    logger.error('Erreur upload GCS', error);
    throw new Error("Erreur lors de l'upload vers GCS");
  }
};

/**
 * Supprimer un fichier de GCS
 */
export const deleteFromGCS = async (filename: string): Promise<void> => {
  try {
    await bucket.file(filename).delete();
    logger.log(`Fichier ${filename} supprimé`);
  } catch (error) {
    logger.error('Erreur suppression GCS', error);
    throw new Error('Erreur lors de la suppression');
  }
};
