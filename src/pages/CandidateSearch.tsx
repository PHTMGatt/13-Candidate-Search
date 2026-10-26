import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import {
  IoBriefcaseOutline,
  IoClose,
  IoCodeSlashOutline,
  IoFilterOutline,
  IoGridOutline,
  IoListOutline,
  IoLocationOutline,
  IoSearchOutline,
} from 'react-icons/io5';
import { searchGithubCandidates } from '../api/API';
import type { Candidate } from '../interfaces/Candidate.interface';
import CandidateCard from '../components/CandidateCard';

type ExperienceFilter = 'any' | 'junior' | 'mid' | 'senior';
type SortMode = 'best' | 'followers' | 'repositories';
type ViewMode = 'list' | 'grid';

type StoredCollectionKey = 'shortlistedCandidates' | 'storedCandidates';

const DEFAULT_QUERY = 'react developer';
const DEFAULT_SKILLS = ['React', 'JavaScript', 'TypeScript'];

const readCollection = (key: StoredCollectionKey): Candidate[] => {
  const stored = localStorage.getItem(key);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Candidate[];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
};

const candidateKey = (candidate: Candidate) => String(candidate.id ?? candidate.login ?? 'unknown');

const toggleCollectionCandidate = (key: StoredCollectionKey, candidate: Candidate) => {
  const current = readCollection(key);
  const targetKey = candidateKey(candidate);
  const alreadyStored = current.some((item) => candidateKey(item) === targetKey);
  const updated = alreadyStored
    ? current.filter((item) => candidateKey(item) !== targetKey)
    : [candidate, ...current];

  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

const yearsOnGithub = (createdAt?: string) => {
  if (!createdAt) return null;
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return null;
  return (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
};

const matchesExperience = (candidate: Candidate, filter: ExperienceFilter) => {
  if (filter === 'any') return true;
  const years = yearsOnGithub(candidate.created_at);
  if (years === null) return false;
  if (filter === 'junior') return years < 2;
  if (filter === 'mid') return years >= 2 && years < 5;
  return years >= 5;
};

const CandidateSearch = () => {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [results, setResults] = useState<Candidate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [skills, setSkills] = useState<string[]>(DEFAULT_SKILLS);
  const [skillInput, setSkillInput] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState<ExperienceFilter>('any');
  const [sortMode, setSortMode] = useState<SortMode>('best');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shortlisted, setShortlisted] = useState<Set<string>>(
    () => new Set(readCollection('shortlistedCandidates').map(candidateKey)),
  );
  const [saved, setSaved] = useState<Set<string>>(
    () => new Set(readCollection('storedCandidates').map(candidateKey)),
  );

  useEffect(() => {
    let cancelled = false;

    const loadInitialResults = async () => {
      try {
        const data = await searchGithubCandidates(DEFAULT_QUERY);
        if (cancelled) return;
        setResults(data.candidates);
        setTotalCount(data.totalCount);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to search GitHub candidates.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadInitialResults();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredResults = useMemo(() => {
    const normalizedLocation = location.trim().toLowerCase();
    const normalizedSkills = skills.map((skill) => skill.toLowerCase());

    const filtered = results.filter((candidate) => {
      const locationMatch = !normalizedLocation
        || candidate.location?.toLowerCase().includes(normalizedLocation);
      const experienceMatch = matchesExperience(candidate, experience);
      const candidateSkills = (candidate.skills ?? []).map((skill) => skill.toLowerCase());
      const skillMatch = normalizedSkills.length === 0
        || normalizedSkills.some((skill) => candidateSkills.includes(skill));

      return Boolean(locationMatch && experienceMatch && skillMatch);
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === 'followers') return (b.followers ?? 0) - (a.followers ?? 0);
      if (sortMode === 'repositories') return (b.public_repos ?? 0) - (a.public_repos ?? 0);
      return (b.matched_repositories ?? 0) - (a.matched_repositories ?? 0)
        || (b.match_score ?? 0) - (a.match_score ?? 0)
        || (b.followers ?? 0) - (a.followers ?? 0);
    });
  }, [experience, location, results, skills, sortMode]);

  const runSearch = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError('');

    try {
      const data = await searchGithubCandidates(query);
      setResults(data.candidates);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to search GitHub candidates.');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    const nextSkill = skillInput.trim();
    if (!nextSkill) return;
    if (!skills.some((skill) => skill.toLowerCase() === nextSkill.toLowerCase())) {
      setSkills((current) => [...current, nextSkill]);
    }
    setSkillInput('');
  };

  const handleSkillKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    addSkill();
  };

  const clearFilters = () => {
    setSkills([]);
    setSkillInput('');
    setLocation('');
    setExperience('any');
    setSortMode('best');
  };

  const toggleShortlist = (candidate: Candidate) => {
    const updated = toggleCollectionCandidate('shortlistedCandidates', candidate);
    setShortlisted(new Set(updated.map(candidateKey)));
  };

  const toggleSaved = (candidate: Candidate) => {
    const updated = toggleCollectionCandidate('storedCandidates', candidate);
    setSaved(new Set(updated.map(candidateKey)));
  };

  return (
    <section className='candidate-page'>
      <div className='hero-copy'>
        <h1>Find your next <span>candidate.</span></h1>
        <p>Search GitHub profiles by skills, location, experience, and real project activity.</p>
      </div>

      <form className='hero-search' onSubmit={(event) => void runSearch(event)}>
        <div className='hero-search-field'>
          <IoSearchOutline aria-hidden='true' />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search developers, frameworks, or technologies'
            aria-label='Search candidates'
          />
          {query && (
            <button type='button' className='search-clear' onClick={() => setQuery('')} aria-label='Clear search'>
              <IoClose aria-hidden='true' />
            </button>
          )}
        </div>
        <button type='submit' className='search-button' disabled={loading || !query.trim()}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div className='search-workspace'>
        <aside className='filters-panel'>
          <div className='filter-panel-heading'>
            <span><IoFilterOutline aria-hidden='true' /> Filters</span>
            <button type='button' onClick={clearFilters}>Clear all</button>
          </div>

          <div className='filter-section'>
            <h2><IoCodeSlashOutline aria-hidden='true' /> Skills</h2>
            <div className='mini-search'>
              <IoSearchOutline aria-hidden='true' />
              <input
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={handleSkillKeyDown}
                onBlur={addSkill}
                placeholder='Add a skill…'
                aria-label='Add skill filter'
              />
            </div>
            <div className='selected-skills'>
              {skills.map((skill) => (
                <button
                  key={skill}
                  type='button'
                  className='selected-skill'
                  onClick={() => setSkills((current) => current.filter((item) => item !== skill))}
                  aria-label={`Remove ${skill} filter`}
                >
                  {skill} <IoClose aria-hidden='true' />
                </button>
              ))}
            </div>
          </div>

          <div className='filter-section'>
            <h2><IoLocationOutline aria-hidden='true' /> Location</h2>
            <input
              className='filter-input'
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder='Any location'
              aria-label='Location filter'
            />
          </div>

          <div className='filter-section'>
            <h2><IoBriefcaseOutline aria-hidden='true' /> Experience</h2>
            <div className='radio-stack'>
              <label><input type='radio' name='experience' checked={experience === 'any'} onChange={() => setExperience('any')} /> Any experience</label>
              <label><input type='radio' name='experience' checked={experience === 'junior'} onChange={() => setExperience('junior')} /> Junior (0–2 years)</label>
              <label><input type='radio' name='experience' checked={experience === 'mid'} onChange={() => setExperience('mid')} /> Mid-level (2–5 years)</label>
              <label><input type='radio' name='experience' checked={experience === 'senior'} onChange={() => setExperience('senior')} /> Senior (5+ years)</label>
            </div>
            <small className='filter-note'>Experience uses GitHub account tenure as a lightweight proxy.</small>
          </div>

          <div className='filter-section'>
            <h2>Sort by</h2>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
              <option value='best'>Best match</option>
              <option value='followers'>Most followers</option>
              <option value='repositories'>Most repositories</option>
            </select>
          </div>
        </aside>

        <div className='results-shell'>
          <div className='results-toolbar'>
            <div>
              <strong>{filteredResults.length} profiles shown</strong>
              <span>{totalCount.toLocaleString()} matching GitHub projects</span>
            </div>
            <div className='toolbar-controls'>
              <label className='toolbar-sort'>
                <span>Sort:</span>
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
                  <option value='best'>Best match</option>
                  <option value='followers'>Followers</option>
                  <option value='repositories'>Repositories</option>
                </select>
              </label>
              <div className='view-toggle' aria-label='Results view'>
                <button
                  type='button'
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                  aria-label='Grid view'
                >
                  <IoGridOutline aria-hidden='true' />
                </button>
                <button
                  type='button'
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                  aria-label='List view'
                >
                  <IoListOutline aria-hidden='true' />
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className='status-panel' role='alert'>
              <strong>Couldn&apos;t search GitHub.</strong>
              <span>{error}</span>
              <button type='button' className='primary-button' onClick={() => void runSearch()}>
                Try again
              </button>
            </div>
          ) : loading && results.length === 0 ? (
            <div className='results-loading' aria-live='polite'>
              <span />
              <span />
              <span />
            </div>
          ) : filteredResults.length > 0 ? (
            <div className={`results-list results-list--${viewMode}`}>
              {filteredResults.map((candidate, index) => {
                const key = candidateKey(candidate);
                return (
                  <CandidateCard
                    key={key}
                    candidate={candidate}
                    rank={index + 1}
                    view={viewMode}
                    isTopMatch={index === 0 && sortMode === 'best'}
                    isShortlisted={shortlisted.has(key)}
                    isSaved={saved.has(key)}
                    onToggleShortlist={toggleShortlist}
                    onToggleSaved={toggleSaved}
                  />
                );
              })}
            </div>
          ) : (
            <div className='empty-state compact'>
              <h2>No profiles match those filters.</h2>
              <p>Clear a filter or run a broader GitHub search.</p>
              <button type='button' className='secondary-button' onClick={clearFilters}>Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CandidateSearch;
