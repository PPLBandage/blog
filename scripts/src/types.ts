export interface CommitInfo {
    sha: string;
    node_id: string;
    commit: Commit;
    url: string;
    html_url: string;
    comments_url: string;
    author: Author;
    committer: Author;
}

interface Author {
    login: string;
    name?: string;
    id: number;
    node_id: string;
    date?: string;
}

interface Commit {
    author: Author;
    committer: Author;
    message: string;
    url: string;
    comment_count: number;
}

export interface WorkflowRuns {
    total_count: number;
    workflow_runs: WorkflowRun[];
}

interface WorkflowRun {
    id: number;
    name: string;
    node_id: string;
    head_branch: string;
    head_sha: string;
    path: string;
    display_title: string;
    run_number: number;
    event: string;
    status: string;
    conclusion: string;
    workflow_id: number;
    check_suite_id: number;
    check_suite_node_id: string;
    url: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    actor: Author;
    run_attempt: number;
    run_started_at: string;
    jobs_url: string;
    logs_url: string;
    check_suite_url: string;
    artifacts_url: string;
    cancel_url: string;
    rerun_url: string;
    previous_attempt_url: null;
    workflow_url: string;
}

export interface CompareRootObject {
    ahead_by: number;
    behind_by: number;
    total_commits: number;
    commits: CommitInfo[];
    files: File[];
}

interface File {
    sha: string;
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
}
