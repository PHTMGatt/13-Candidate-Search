import type { Candidate } from '../interfaces/Candidate.interface';
import {
  IoBookmark,
  IoBookmarkOutline,
  IoBusinessOutline,
  IoFolderOutline,
  IoLocationOutline,
  IoLogoGithub,
  IoPeopleOutline,
  IoStar,
  IoStarOutline,
} from 'react-icons/io5';

type CandidateCardProps = {
  candidate: Candidate;
  rank: number;
  view: 'list' | 'grid';
  isTopMatch?: boolean;
  isShortlisted: boolean;
  isSaved: boolean;
  onToggleShortlist: (candidate: Candidate) => void;
  onToggleSaved: (candidate: Candidate) => void;
};

const formatCount = (value?: number) => {
  if (value === undefined) return '—';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString();
};

const CandidateCard = ({
  candidate,
  rank,
  view,
  isTopMatch = false,
  isShortlisted,
  isSaved,
  onToggleShortlist,
  onToggleSaved,
}: CandidateCardProps) => {
  const displayName = candidate.name || candidate.login || 'GitHub candidate';
  const skills = candidate.skills?.length ? candidate.skills : ['GitHub'];

  return (
    <article className={`result-card result-card--${view}${isTopMatch ? ' result-card--top' : ''}`}>
      <div className='result-avatar-wrap'>
        <img
          className='result-avatar'
          src={candidate.avatar_url || 'https://placehold.co/320x320?text=GitHub'}
          alt={`GitHub profile for ${displayName}`}
        />
        <span className='github-avatar-badge' aria-label='GitHub profile'>
          <IoLogoGithub aria-hidden='true' />
        </span>
      </div>

      <div className='result-main'>
        <div className='result-heading-row'>
          <div className='result-heading'>
            <div className='result-title-line'>
              <h2>{displayName}</h2>
              {isTopMatch && <span className='top-match'><IoStar aria-hidden='true' /> Top match</span>}
            </div>
            <a href={candidate.html_url || '#'} target='_blank' rel='noreferrer' className='candidate-handle'>
              @{candidate.login}
            </a>
          </div>

          <div className='card-quick-actions'>
            <button
              type='button'
              className={`icon-action${isShortlisted ? ' active' : ''}`}
              onClick={() => onToggleShortlist(candidate)}
              aria-label={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
              title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
            >
              {isShortlisted ? <IoStar aria-hidden='true' /> : <IoStarOutline aria-hidden='true' />}
            </button>
            <button
              type='button'
              className={`icon-action${isSaved ? ' active' : ''}`}
              onClick={() => onToggleSaved(candidate)}
              aria-label={isSaved ? 'Remove from saved' : 'Save candidate'}
              title={isSaved ? 'Remove from saved' : 'Save candidate'}
            >
              {isSaved ? <IoBookmark aria-hidden='true' /> : <IoBookmarkOutline aria-hidden='true' />}
            </button>
          </div>
        </div>

        <div className='result-meta'>
          <span><IoLocationOutline aria-hidden='true' /> {candidate.location || 'Location not listed'}</span>
          <span><IoBusinessOutline aria-hidden='true' /> {candidate.company || 'Independent / not listed'}</span>
          <span className='result-rank'>#{rank}</span>
        </div>

        <p className='result-bio'>
          {candidate.bio || 'Public GitHub profile discovered through projects matching your search.'}
        </p>

        <div className='skill-tags' aria-label='Candidate skills'>
          {skills.slice(0, 5).map((skill) => (
            <span key={skill} className='skill-tag'>{skill}</span>
          ))}
          {skills.length > 5 && <span className='skill-tag skill-tag--more'>+{skills.length - 5}</span>}
        </div>
      </div>

      <aside className='result-stats' aria-label={`${displayName} GitHub stats`}>
        <div className='stats-list'>
          <span><IoFolderOutline aria-hidden='true' /> <strong>{formatCount(candidate.public_repos)}</strong> repositories</span>
          <span><IoPeopleOutline aria-hidden='true' /> <strong>{formatCount(candidate.followers)}</strong> followers</span>
          <span><IoPeopleOutline aria-hidden='true' /> <strong>{formatCount(candidate.following)}</strong> following</span>
          <span><IoLogoGithub aria-hidden='true' /> <strong>{candidate.matched_repositories ?? 1}</strong> matching projects</span>
        </div>

        <a
          href={candidate.html_url || '#'}
          target='_blank'
          rel='noreferrer'
          className='github-profile-button'
        >
          <IoLogoGithub aria-hidden='true' /> View GitHub Profile
        </a>
      </aside>
    </article>
  );
};

export default CandidateCard;
