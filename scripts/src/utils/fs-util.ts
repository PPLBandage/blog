import { readdir, readFile } from 'fs/promises';
export { readFile };

export const getListDirs = async (target: string): Promise<string[]> => {
    const contents = await readdir(target, { withFileTypes: true });
    return contents
        .filter(i => i.isDirectory())
        .map(i => `${target}/${i.name}`);
};
