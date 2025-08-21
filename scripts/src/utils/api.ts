import dotenv from 'dotenv';
import { CommitInfo, CompareRootObject, WorkflowRuns } from '../types';
dotenv.config();

const GITHUB_API_URL = process.env.GITHUB_API_URL ?? 'https://api.github.com';
const TOKEN = process.env.TOKEN;

export const getCommitHistoryFile = async (
    repo_url: string,
    file_path: string
): Promise<CommitInfo[]> => {
    const response = await fetch(
        `${GITHUB_API_URL}/repos/${repo_url}/commits?path=${file_path}&per_page=100`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
    );

    if (!response.ok)
        throw new Error(`Cannot get commits list: ${response.status}`);

    return await response.json();
};

export const commitDiff = async (
    repo_url: string,
    sha: string
): Promise<CompareRootObject> => {
    const workflow_runs = await getWorkflows(repo_url);
    if (workflow_runs.total_count === 0)
        throw new Error('Latest workflow not found');

    const head_sha = workflow_runs.workflow_runs.find(w =>
        w.name.toLowerCase().includes('index')
    )!.head_sha;

    const response = await fetch(
        `${GITHUB_API_URL}/repos/${repo_url}/compare/${head_sha}...${sha}`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
    );

    if (!response.ok)
        throw new Error(`Cannot load commit diff: ${response.status}`);

    return await response.json();
};

export const getWorkflows = async (repo_url: string): Promise<WorkflowRuns> => {
    const response = await fetch(
        `${GITHUB_API_URL}/repos/${repo_url}/actions/workflows/index.yml/runs?status=success&per_page=1`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
    );

    if (!response.ok)
        throw new Error(`Cannot get latest workflow run: ${response.status}`);

    return await response.json();
};
