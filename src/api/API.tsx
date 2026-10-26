import type { Candidate, CandidateSearchResult } from '../interfaces/Candidate.interface';

const githubHeaders: HeadersInit = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

const ensureOk = (response: Response) => {
  if (response.ok) return;

  if (response.status === 403) {
    throw new Error('GitHub API rate limit reached. Try again in a little while.');
  }

  if (response.status === 422) {
    throw new Error('GitHub could not run that search. Try a broader search term.');
  }

  throw new Error(`GitHub request failed with status ${response.status}.`);
};

type GithubRepositoryOwner = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
};

type GithubRepository = {
  owner: GithubRepositoryOwner | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
};

type GithubRepositorySearchResponse = {
  total_count: number;
  items: GithubRepository[];
};

type CandidateSeed = {
  candidate: Candidate;
  skills: Set<string>;
  matches: number;
  score: number;
};

const normalizeSearchTerm = (value: string) => {
  const stripped = value
    .replace(/\b(candidate|developer|engineer|programmer|software|full[ -]?stack)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return stripped || 'web';
};

const normalizeSkill = (value: string) => {
  const key = value.toLowerCase().replace(/[._\s-]/g, '');
  const knownSkills: Record<string, string> = {
    react: 'React',
    reactjs: 'React',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    node: 'Node.js',
    nodejs: 'Node.js',
    next: 'Next.js',
    nextjs: 'Next.js',
    python: 'Python',
    java: 'Java',
    csharp: 'C#',
    cpp: 'C++',
    go: 'Go',
    golang: 'Go',
    rust: 'Rust',
    php: 'PHP',
    ruby: 'Ruby',
    html: 'HTML',
    css: 'CSS',
    tailwind: 'Tailwind CSS',
    tailwindcss: 'Tailwind CSS',
    aws: 'AWS',
    docker: 'Docker',
    kubernetes: 'Kubernetes',
    mongodb: 'MongoDB',
    postgres: 'PostgreSQL',
    postgresql: 'PostgreSQL',
  };

  return knownSkills[key] || null;
};

const skillsFromQuery = (query: string) => {
  const tokens = query.toLowerCase().split(/[^a-z0-9+#.]+/).filter(Boolean);
  return tokens.map(normalizeSkill).filter((skill): skill is string => Boolean(skill));
};

const searchGithubUser = async (username: string): Promise<Candidate> => {
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: githubHeaders,
  });

  ensureOk(response);
  return (await response.json()) as Candidate;
};

const searchGithubCandidates = async (
  query: string,
  resultLimit = 12,
): Promise<CandidateSearchResult> => {
  const normalizedQuery = normalizeSearchTerm(query);
  const params = new URLSearchParams({
    q: `${normalizedQuery} fork:false`,
    sort: 'stars',
    order: 'desc',
    per_page: '50',
  });

  const response = await fetch(`https://api.github.com/search/repositories?${params.toString()}`, {
    headers: githubHeaders,
  });

  ensureOk(response);
  const payload = (await response.json()) as GithubRepositorySearchResponse;
  const querySkills = skillsFromQuery(query);
  const owners = new Map<string, CandidateSeed>();

  for (const repository of payload.items) {
    const owner = repository.owner;
    if (!owner?.login || owner.type !== 'User') continue;

    const existing = owners.get(owner.login) ?? {
      candidate: {
        id: owner.id,
        login: owner.login,
        name: null,
        location: null,
        avatar_url: owner.avatar_url,
        email: null,
        html_url: owner.html_url,
        company: null,
        bio: null,
        type: owner.type,
      },
      skills: new Set<string>(),
      matches: 0,
      score: 0,
    };

    if (repository.language) {
      existing.skills.add(normalizeSkill(repository.language) || repository.language);
    }

    for (const topic of repository.topics ?? []) {
      const normalized = normalizeSkill(topic);
      if (normalized) existing.skills.add(normalized);
    }

    for (const skill of querySkills) existing.skills.add(skill);

    existing.matches += 1;
    existing.score += Math.max(repository.stargazers_count, 1);
    owners.set(owner.login, existing);
  }

  const seeds = [...owners.values()]
    .sort((a, b) => b.matches - a.matches || b.score - a.score)
    .slice(0, Math.max(1, resultLimit));

  const candidates = await Promise.all(
    seeds.map(async (seed) => {
      try {
        const details = await searchGithubUser(seed.candidate.login ?? '');
        return {
          ...details,
          skills: [...seed.skills].slice(0, 6),
          matched_repositories: seed.matches,
          match_score: seed.score,
        };
      } catch {
        return {
          ...seed.candidate,
          skills: [...seed.skills].slice(0, 6),
          matched_repositories: seed.matches,
          match_score: seed.score,
        };
      }
    }),
  );

  return {
    candidates,
    totalCount: payload.total_count,
  };
};

export { searchGithubCandidates, searchGithubUser };
