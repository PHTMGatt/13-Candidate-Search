import { useEffect, useState } from 'react';
import { IoClose, IoFolderOutline, IoLocationOutline, IoLogoGithub, IoPeopleOutline } from 'react-icons/io5';
import type { Candidate } from '../interfaces/Candidate.interface';

type CandidateCollectionProps = {
  storageKey: 'shortlistedCandidates' | 'storedCandidates';
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
};

const formatCount = (value?: number) => {
  if (value === undefined) return '—';
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString();
};

const candidateKey = (candidate: Candidate) => String(candidate.id ?? candidate.login ?? 'unknown');

const SavedCandidates = ({
  storageKey,
  eyebrow,
  title,
  description,
  emptyTitle,
}: CandidateCollectionProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      setCandidates([]);
      return;
    }

    try {
      setCandidates(JSON.parse(stored) as Candidate[]);
    } catch {
      localStorage.removeItem(storageKey);
      setCandidates([]);
    }
  }, [storageKey]);

  const removeCandidate = (candidate: Candidate) => {
    const key = candidateKey(candidate);
    const updated = candidates.filter((item) => candidateKey(item) !== key);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setCandidates(updated);
  };

  return (
    <section className='collection-page'>
      <div className='collection-hero'>
        <div>
          <span className='eyebrow'>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <span className='saved-count'>{candidates.length} {candidates.length === 1 ? 'profile' : 'profiles'}</span>
      </div>

      {candidates.length > 0 ? (
        <div className='collection-grid'>
          {candidates.map((candidate) => {
            const displayName = candidate.name || candidate.login || 'GitHub candidate';
            return (
              <article className='collection-card' key={candidateKey(candidate)}>
                <div className='collection-card-top'>
                  <img
                    src={candidate.avatar_url || 'https://placehold.co/160x160?text=GitHub'}
                    alt={`GitHub profile for ${displayName}`}
                  />
                  <button
                    type='button'
                    className='remove-candidate'
                    onClick={() => removeCandidate(candidate)}
                    aria-label={`Remove ${displayName}`}
                  >
                    <IoClose aria-hidden='true' />
                  </button>
                </div>

                <div className='collection-card-body'>
                  <h2>{displayName}</h2>
                  <a href={candidate.html_url || '#'} target='_blank' rel='noreferrer' className='candidate-handle'>
                    @{candidate.login}
                  </a>

                  <div className='collection-meta'>
                    <span><IoLocationOutline aria-hidden='true' /> {candidate.location || 'Location not listed'}</span>
                    <span><IoFolderOutline aria-hidden='true' /> {formatCount(candidate.public_repos)} repos</span>
                    <span><IoPeopleOutline aria-hidden='true' /> {formatCount(candidate.followers)} followers</span>
                  </div>

                  <p>{candidate.bio || 'Public GitHub candidate profile.'}</p>

                  <div className='skill-tags'>
                    {(candidate.skills ?? []).slice(0, 4).map((skill) => (
                      <span key={skill} className='skill-tag'>{skill}</span>
                    ))}
                  </div>

                  <a href={candidate.html_url || '#'} target='_blank' rel='noreferrer' className='github-profile-button'>
                    <IoLogoGithub aria-hidden='true' /> View GitHub Profile
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className='empty-state'>
          <span className='eyebrow'>Nothing here yet</span>
          <h2>{emptyTitle}</h2>
          <p>Search GitHub candidates and use the star or bookmark controls to build this list.</p>
        </div>
      )}
    </section>
  );
};

export default SavedCandidates;
