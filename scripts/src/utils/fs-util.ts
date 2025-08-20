import { readdir, readFile, stat, writeFile } from 'fs/promises';
export { readFile, writeFile };

export const getListDirs = async (target: string): Promise<string[]> => {
    const contents = await readdir(target, { withFileTypes: true });
    return contents
        .filter(i => i.isDirectory())
        .map(i => `${target}/${i.name}`);
};

export const folderExists = async (path: string): Promise<boolean> => {
    try {
        const stats = await stat(path);
        return stats.isDirectory();
    } catch {
        return false;
    }
};
