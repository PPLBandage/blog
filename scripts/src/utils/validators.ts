import { object, string, boolean, date } from 'yup';
import { readFile } from './fs-util';

const metaSchema = object({
    title: string().required(),
    description: string().optional(),
    category: string().optional(),
    pinned: boolean().optional(),
    override_author: string().optional(),
    override_date: date().optional()
});

export const validateMeta = async (path: string) => {
    try {
        const fileContents = await readFile(path);
        return await metaSchema.validate(JSON.parse(fileContents.toString()));
    } catch (e) {
        throw new Error(`❌ Could not validate ${path}: ${e}`);
    }
};
