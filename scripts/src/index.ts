import { getListDirs } from './utils/fs-util';
import { validateMeta } from './utils/validators';

const PAGES_DIR = 'pages';

// Jump to parent dir for local dev
if (process.env.GITHUB_ACTIONS !== 'true') {
    process.chdir('..');
}

const main = async () => {
    const pages = await getListDirs(PAGES_DIR);

    for (const page of pages) {
        console.info(`☕ Processing ${page}...`);

        const meta = await validateMeta(`${page}/meta.json`);
        console.log(meta);
    }
};

void main();
