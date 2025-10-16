import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocumentPath = path.resolve(__dirname, '../../docs/swagger.json');
const swaggerDocument = JSON.parse(readFileSync(swaggerDocumentPath, 'utf-8'));

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
