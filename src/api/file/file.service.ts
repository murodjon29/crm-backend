import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
import { v4 as uuid } from 'uuid';
import { config } from 'src/config';

@Injectable()
export class FileService {
  private readonly uploadPath = join(process.cwd(), 'uploads'); // 📂 src yonida uploads

  constructor() {
    this.ensureUploadsFolder();
  }

  private async ensureUploadsFolder() {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
    } catch (err) {
      throw new InternalServerErrorException('Uploads papkasi yaratilolmadi');
    }
  }

  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const ext = file.originalname.split('.').pop();
      const fileName = `${uuid()}.${ext}`;
      const filePath = join(this.uploadPath, fileName);

      await fs.writeFile(filePath, file.buffer);

      // 🔗 qaytadigan URL
      return `${config.BASE_API}/uploads/${fileName}`;
    } catch (err) {
      throw new InternalServerErrorException('Fayl saqlashda xato');
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fileName = fileUrl.split('/uploads/')[1];
      if (!fileName) return;

      const filePath = join(this.uploadPath, fileName);
      await fs.unlink(filePath);
    } catch (err) {
      // fayl bo‘lmasa e’tibor bermaymiz
    }
  }

  async existFile(fileUrl: string): Promise<boolean> {
    try {
      const fileName = fileUrl.split('/uploads/')[1];
      if (!fileName) return false;

      const filePath = join(this.uploadPath, fileName);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
