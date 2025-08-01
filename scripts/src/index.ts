import { getListDirs } from './utils/fs-util';

const main = async () => {
    console.log(process.cwd());
    console.log(await getListDirs('.'));
};

void main();
