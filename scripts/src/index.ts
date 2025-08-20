import { validateMeta } from './utils/validators';
import './utils/api';
import { commitDiff, getCommitHistoryFile } from './utils/api';
import { folderExists, readFile, writeFile } from './utils/fs-util';

const PAGES_DIR = 'pages';
const COMMIT_SHA = process.env.COMMIT_SHA!;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY!;

// Jump to parent dir for local dev
if (process.env.GITHUB_ACTIONS !== 'true') {
    process.chdir('..');
}

const main = async () => {
    const affected_files = await commitDiff(GITHUB_REPOSITORY, COMMIT_SHA);
    const affected_pages = affected_files.files.filter(file =>
        file.filename.startsWith(PAGES_DIR)
    );

    if (affected_pages.length === 0) {
        console.info('✔️  No affected pages found, exiting...');
        return;
    }

    const index_data = JSON.parse((await readFile('index.json')).toString());

    for (const page of affected_pages) {
        const page_name = page.filename.split('/').at(1)!;
        const page_dir = `${PAGES_DIR}/${page_name}`;
        console.info(`☕ Processing ${page_name}...`);

        const page_exists = folderExists(page_dir);
        if (!page_exists) {
            delete index_data[page_name];
            console.info(`🗑️ ${page_name} has been removed, skipping...`);
            continue;
        }

        const meta = await validateMeta(`${page_dir}/meta.json`);
        const file_history = await getCommitHistoryFile(
            GITHUB_REPOSITORY,
            `${page_dir}/page.md`
        );

        const existing_meta = index_data[page_name];
        const author: string =
            existing_meta?.author ||
            file_history.reverse().at(0)?.commit.author.name;

        const existing_collaborators: string[] =
            existing_meta?.collaborators || [];
        const collaborators = Array.from(
            new Set(
                existing_collaborators.concat(
                    file_history.map(h => h.commit.author.name!)
                )
            )
        );

        const created =
            existing_meta?.created ||
            file_history.reverse().at(0)?.commit.author.date;

        index_data[page_name] = {
            title: meta.title,
            description: meta.description,
            created,
            author: meta.override_author ?? author,
            collaborators: collaborators.filter(i => i !== author),
            category: meta.category ?? '',
            pinned: meta.pinned ?? false
        };

        console.info(`✔️  Processed page ${page_name}`);
    }

    writeFile('index.json', JSON.stringify(index_data));
    console.info(`✔️  Processed ${affected_pages.length} pages`);
};

void main();
