import { useEffect, useState } from 'react';
import type { Candidate } from '../interfaces/Candidate.interface';
import SavedCandidate from '../components/savedCandidates';

const SavedCandidates = () => {
  const [potentialCandidates, setPotentialCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('storedCandidates');
    if (!stored) return;

    try {
      setPotentialCandidates(JSON.parse(stored) as Candidate[]);
    } catch {
      localStorage.removeItem('storedCandidates');
    }
  }, []);

  const rejectCandidate = (id: number | null) => {
    if (id === null) return;

    const updated = potentialCandidates.filter((candidate) => candidate.id !== id);
    localStorage.setItem('storedCandidates', JSON.stringify(updated));
    setPotentialCandidates(updated);
  };

  return (
    <section className='saved-page'>
      <div className='page-intro page-intro--row'>
        <div>
          <span className='eyebrow'>Your shortlist</span>
          <h1>Potential candidates.</h1>
          <p>Profiles you saved while browsing stay here on this device.</p>
        </div>
        <span className='saved-count'>{potentialCandidates.length} saved</span>
      </div>

      {potentialCandidates.length > 0 ? (
        <div className='saved-grid'>
          {potentialCandidates.map((candidate) => (
            <SavedCandidate
              key={candidate.id ?? candidate.login}
              candidate={candidate}
              rejectCandidate={rejectCandidate}
            />
          ))}
        </div>
      ) : (
        <div className='empty-state'>
          <span className='eyebrow'>Nothing saved yet</span>
          <h2>Your shortlist is empty.</h2>
          <p>Head back to Candidate Search and save a few profiles worth revisiting.</p>
        </div>
      )}
    </section>
  );
};

export default SavedCandidates;
