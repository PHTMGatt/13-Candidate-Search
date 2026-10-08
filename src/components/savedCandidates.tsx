import type { Candidate } from '../interfaces/Candidate.interface';
import { IoTrashOutline, IoLogoGithub, IoLocationOutline, IoBusinessOutline } from 'react-icons/io5';

type SavedCandidateProps = {
  candidate: Candidate;
  rejectCandidate: (id: number | null) => void;
};

const SavedCandidate = ({ candidate, rejectCandidate }: SavedCandidateProps) => {
  const displayName = candidate.name || candidate.login || 'GitHub candidate';

  return (
    <article className='saved-card'>
      <img
        className='saved-avatar'
        src={candidate.avatar_url || 'https://placehold.co/320x320?text=GitHub+User'}
        alt={`Profile for ${displayName}`}
      />

      <div className='saved-card-body'>
        <div className='saved-card-heading'>
          <div>
            <h2>{displayName}</h2>
            {candidate.login ? <span>@{candidate.login}</span> : null}
          </div>
          <button
            type='button'
            className='icon-button'
            onClick={() => rejectCandidate(candidate.id)}
            aria-label={`Remove ${displayName} from saved candidates`}
          >
            <IoTrashOutline aria-hidden='true' />
          </button>
        </div>

        <div className='saved-meta'>
          <span><IoLocationOutline aria-hidden='true' /> {candidate.location || 'Location not listed'}</span>
          <span><IoBusinessOutline aria-hidden='true' /> {candidate.company || 'Company not listed'}</span>
        </div>

        <p>{candidate.bio || 'No public bio available.'}</p>

        {candidate.html_url ? (
          <a className='github-link' href={candidate.html_url} target='_blank' rel='noreferrer'>
            <IoLogoGithub aria-hidden='true' /> View GitHub profile
          </a>
        ) : null}
      </div>
    </article>
  );
};

export default SavedCandidate;
