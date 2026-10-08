import { useEffect, useState } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import type { Candidate } from '../interfaces/Candidate.interface';
import CandidateCard from '../components/CandidateCard';

const REFERENCE_CANDIDATE = 'jmo5896';

const CandidateSearch = () => {
  const [results, setResults] = useState<Candidate[]>([]);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [index, setIndex] = useState(0);
  const [showingReference, setShowingReference] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCandidate = async (list: Candidate[], candidateIndex: number) => {
    const login = list[candidateIndex]?.login;
    if (!login) {
      throw new Error('No candidate username was returned by GitHub.');
    }

    const details = await searchGithubUser(login);
    setCandidate(details);
  };

  const loadRandomBatch = async () => {
    const data = await searchGithub();
    if (data.length === 0) {
      throw new Error('No candidates were returned.');
    }

    setResults(data);
    setIndex(0);
    return data;
  };

  const initializeCandidates = async () => {
    setLoading(true);
    setError('');

    try {
      await loadRandomBatch();

      // Show a known, fully populated profile first so every supported field
      // is visibly demonstrated before cycling through random GitHub users.
      const referenceProfile = await searchGithubUser(REFERENCE_CANDIDATE);
      setCandidate(referenceProfile);
      setShowingReference(true);
    } catch (err) {
      setCandidate(null);
      setError(err instanceof Error ? err.message : 'Unable to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void initializeCandidates();
  }, []);

  const saveCandidate = (selectedCandidate: Candidate) => {
    const stored = localStorage.getItem('storedCandidates');
    let savedCandidates: Candidate[] = [];

    if (stored) {
      try {
        savedCandidates = JSON.parse(stored) as Candidate[];
      } catch {
        savedCandidates = [];
      }
    }

    const alreadySaved = savedCandidates.some((item) => item.id === selectedCandidate.id);
    if (!alreadySaved) {
      savedCandidates.push(selectedCandidate);
      localStorage.setItem('storedCandidates', JSON.stringify(savedCandidates));
    }
  };

  const selectCandidate = async (isSelected: boolean) => {
    if (!candidate || loading) return;

    if (isSelected) {
      saveCandidate(candidate);
    }

    setLoading(true);
    setError('');

    try {
      if (showingReference) {
        setShowingReference(false);
        setIndex(0);
        await loadCandidate(results, 0);
        return;
      }

      const nextIndex = index + 1;
      if (nextIndex < results.length) {
        setIndex(nextIndex);
        await loadCandidate(results, nextIndex);
      } else {
        const freshResults = await loadRandomBatch();
        await loadCandidate(freshResults, 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load the next candidate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='candidate-page'>
      <div className='page-intro'>
        <span className='eyebrow'>GitHub talent discovery</span>
        <h1>Find your next candidate.</h1>
        <p>
          Review public GitHub profiles one at a time. The first profile is a reference example that demonstrates every supported profile field; random candidates may leave some fields blank.
        </p>
      </div>

      {error ? (
        <div className='status-panel' role='alert'>
          <strong>Couldn&apos;t load candidates.</strong>
          <span>{error}</span>
          <button type='button' className='primary-button' onClick={() => void initializeCandidates()}>
            Try again
          </button>
        </div>
      ) : (
        <CandidateCard
          resultingCandidate={candidate}
          selectCandidate={selectCandidate}
          loading={loading}
        />
      )}
    </section>
  );
};

export default CandidateSearch;
