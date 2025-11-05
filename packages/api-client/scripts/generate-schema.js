import fs from 'node:fs';
import path from 'node:path';
import openapiTS, { astToString } from 'openapi-typescript';
import { fileURLToPath } from 'url';

// Define ESM equivalents for __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSchema() {
    const ast = await openapiTS(
        new URL('http://localhost:8080/api/v3/api-docs', import.meta.url),
    );
    const contents = astToString(ast);

    const outputPath = path.join(__dirname, '../schema/schema.d.ts');

    // This will overwrite existing file with new content
    fs.writeFileSync(outputPath, contents, { encoding: 'utf8' });

    console.log(`Schema written to ${outputPath}`);
}

generateSchema().catch(console.error);
