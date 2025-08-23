import { validateMeta } from './utils/validators';
import './utils/api';
import { commitDiff, getCommitHistoryFile } from './utils/api';
import { fileExists, folderExists, readFile, writeFile } from './utils/fs-util';

const PAGES_DIR = 'pages';
const COMMIT_SHA = process.env.COMMIT_SHA!;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY!;

// Jump to parent dir for local dev
if (process.env.GITHUB_ACTIONS !== 'true') {
    process.chdir('..');
}

const main = async () => {
    const index_data = JSON.parse((await readFile('index.json')).toString());
    const affected_files = await commitDiff(GITHUB_REPOSITORY, COMMIT_SHA);
    const affected_pages = affected_files.files.filter(file =>
        file.filename.startsWith(PAGES_DIR)
    );

    if (affected_pages.length === 0) {
        console.info('✔️  No affected pages found, exiting...');
        return;
    }

    const renamed = affected_pages
        .filter(page => page.status === 'renamed')
        .map(page => page.previous_filename!.split('/').at(1)!);
    const affected_pages_names = Array.from(
        new Set([
            ...affected_pages.map(page => page.filename.split('/').at(1)!),
            ...renamed
        ])
    );
    for (const page_name of affected_pages_names) {
        const page_dir = `${PAGES_DIR}/${page_name}`;
        console.info(`☕ Processing ${page_name}...`);

        const page_exists = await folderExists(page_dir);
        if (!page_exists) {
            delete index_data[page_name];
            console.info(`🗑️  ${page_name} has been removed, skipping...`);
            continue;
        }

        if (!(await fileExists(`${page_dir}/page.md`)))
            throw new Error(`❌ Page.md not found in page ${page_name}`);

        const meta = await validateMeta(`${page_dir}/meta.json`);
        const file_history = await getCommitHistoryFile(
            GITHUB_REPOSITORY,
            `${page_dir}/page.md`
        );

        const existing_meta = index_data[page_name];
        const author: string =
            existing_meta?.author || file_history.reverse().at(0)?.author.login;

        const existing_collaborators: string[] =
            existing_meta?.collaborators || [];
        const collaborators = Array.from(
            new Set([
                ...existing_collaborators,
                ...file_history.map(h => h.author.login!)
            ])
        );

        const created =
            existing_meta?.created ||
            file_history.reverse().at(0)?.commit.author.date;

        index_data[page_name] = {
            title: meta.title,
            description: meta.description,
            created: meta.override_date ?? created,
            author: meta.override_author || author,
            collaborators: collaborators.filter(i => i !== author),
            category: meta.category ?? '',
            pinned: meta.pinned ?? false
        };

        console.info(`✔️  Processed page ${page_name}`);
    }

    writeFile('index.json', JSON.stringify(index_data, null, 4));
    console.info(`✔️  Processed ${affected_pages_names.length} pages`);
};

void main();
