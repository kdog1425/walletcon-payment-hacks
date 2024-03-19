import {generate} from 'openapi-typescript-codegen';

import {v4 as uuidv4} from 'uuid';
import {mkdirpSync, moveSync, readdirSync, removeSync} from 'fs-extra';
import * as path from 'path';
import {join} from 'path';
import {writeFileSync} from 'fs';

const interfacesDestinationPath = join(__dirname, 'interfaces');
const openApiPath = join(__dirname, 'payment-server-openapi.yaml');

async function generateDataInterfaces() {
    removeSync(interfacesDestinationPath);
    mkdirpSync(interfacesDestinationPath);
    const tempFolderPath = `./${uuidv4()}`;
    mkdirpSync(tempFolderPath);
    await generate({
        input: openApiPath,
        output: tempFolderPath,
    });
    const interfacesFiles = readdirSync(join(tempFolderPath, 'models'));
    let indexTsContent = '';
    for (const interfacesFile of interfacesFiles) {
        moveSync(join(tempFolderPath, 'models', interfacesFile), join(interfacesDestinationPath, interfacesFile));
        indexTsContent += `export * from './${path.basename(interfacesFile, '.ts')}';\n`;
    }
    writeFileSync(join(interfacesDestinationPath, 'index.ts'), indexTsContent);
    removeSync(tempFolderPath);
}

generateDataInterfaces()
    .then(() =>
        console.log('✅ Data interfaces generated successfully')
    )
    .catch((e) => console.error('❌ Data interfaces failed to generate', e));
