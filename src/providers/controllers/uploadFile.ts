import { Request, Response } from 'express';
import { uploadToGCS } from '../../appServices/storage.service';
import providersService from '../services/providers.service';
import { User } from '../../user/type';

const uploadFile = async (req: Request, res: Response) => {
  try {
    // const { userId } = req.params;
    const userId = (req.user as User).id;
    if (!userId || userId.trim() === '') {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const imageUrl = await uploadToGCS(req.file.buffer, req.file.originalname, req.file.mimetype);
    await providersService.updateProvider(userId, imageUrl);

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  }
};

export default uploadFile;
