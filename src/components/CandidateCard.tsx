import type { Candidate } from '../interfaces/Candidate.interface';
import { IoCheckmark, IoClose, IoLogoGithub, IoLocationOutline, IoBusinessOutline, IoMailOutline } from 'react-icons/io5';

type CandidateCardProps = {
  resultingCandidate: Candidate | null;
  selectCandidate: (isSelected: boolean) => void | Promise<void>;
  loading?: boolean;
};

const CandidateCard = ({ resultingCandidate, selectCandidate, loading = false }: CandidateCardProps) => {
  if (loading && !resultingCandidate) {
    return (
      <div className='candidate-card candidate-card--loading' aria-live='polite'>
        <div className='profile-skeleton' />
        <div className='profile-skeleton profile-skeleton--text' />
        <div className='profile-skeleton profile-skeleton--text short' />
      </div>
    );
  }

  if (!resultingCandidate?.login) {
    return <div className='status-panel'>No candidates are available right now.</div>;
  }

  const displayName = resultingCandidate.name || resultingCandidate.login;

  return (
    <article className='candidate-card'>
      <div className='candidate-media'>
        <img
          src={resultingCandidate.avatar_url || 'https://placehold.co/640x640?text=GitHub+User'}
          alt={`GitHub profile for ${displayName}`}
        />
        <span className='candidate-source'><IoLogoGithub aria-hidden='true' /> GitHub profile</span>
      </div>

      <div className='candidate-body'>
        <div className='candidate-heading'>
          <div>
            <span className='eyebrow'>Candidate profile</span>
            <h2>{displayName}</h2>
            <a href={resultingCandidate.html_url || '#'} target='_blank' rel='noreferrer'>
              @{resultingCandidate.login}
            </a>
          </div>
        </div>

        <div className='candidate-details'>
          <p><IoLocationOutline aria-hidden='true' /><span>{resultingCandidate.location || 'Location not listed'}</span></p>
          <p><IoBusinessOutline aria-hidden='true' /><span>{resultingCandidate.company || 'Company not listed'}</span></p>
          <p><IoMailOutline aria-hidden='true' /><span>{resultingCandidate.email || 'Email not public'}</span></p>
        </div>

        <p className='candidate-bio'>
          {resultingCandidate.bio || 'This candidate has not added a public bio yet.'}
        </p>

        <div className='candidate-actions'>
          <button
            type='button'
            className='decision-button decision-button--skip'
            onClick={() => void selectCandidate(false)}
            disabled={loading}
          >
            <IoClose aria-hidden='true' />
            Skip
          </button>
          <button
            type='button'
            className='decision-button decision-button--save'
            onClick={() => void selectCandidate(true)}
            disabled={loading}
          >
            <IoCheckmark aria-hidden='true' />
            Save candidate
          </button>
        </div>
      </div>
    </article>
  );
};

export default CandidateCard;
