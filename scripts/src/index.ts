import { getListDirs } from './utils/fs-util';

const main = async () => {
    console.log(process.env);
    console.log(process.cwd());
    console.log(await getListDirs('.'));

    // Допустим я что-то написал тут очень важное что пиздец умереть смерть
};

void main();
