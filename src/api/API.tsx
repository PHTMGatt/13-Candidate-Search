import type { Candidate } from '../interfaces/Candidate.interface';

const githubHeaders: HeadersInit = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

const ensureOk = (response: Response) => {
  if (response.ok) return;

  if (response.status === 403) {
    throw new Error('GitHub API rate limit reached. Try again in a little while.');
  }

  throw new Error(`GitHub request failed with status ${response.status}.`);
};

const searchGithub = async (): Promise<Candidate[]> => {
  const start = Math.floor(Math.random() * 100_000_000) + 1;
  const response = await fetch(`https://api.github.com/users?since=${start}&per_page=30`, {
    headers: githubHeaders,
  });

  ensureOk(response);
  return (await response.json()) as Candidate[];
};

const searchGithubUser = async (username: string): Promise<Candidate> => {
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: githubHeaders,
  });

  ensureOk(response);
  return (await response.json()) as Candidate;
};

export { searchGithub, searchGithubUser };
