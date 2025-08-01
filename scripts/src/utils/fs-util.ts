import { readdir } from 'fs/promises';

export const getListDirs = async (target: string): Promise<string[]> => {
    const contents = await readdir(target, { withFileTypes: true });
    return contents.filter(i => i.isDirectory()).map(i => i.name);
};
