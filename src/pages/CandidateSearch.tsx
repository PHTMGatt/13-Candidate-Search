import { useEffect, useState } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import type { Candidate } from '../interfaces/Candidate.interface';
import CandidateCard from '../components/CandidateCard';

const CandidateSearch = () => {
  const [results, setResults] = useState<Candidate[]>([]);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [index, setIndex] = useState(0);
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

  const loadCandidates = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await searchGithub();
      if (data.length === 0) {
        throw new Error('No candidates were returned.');
      }

      setResults(data);
      setIndex(0);
      await loadCandidate(data, 0);
    } catch (err) {
      setCandidate(null);
      setError(err instanceof Error ? err.message : 'Unable to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCandidates();
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

    const nextIndex = index + 1;
    setLoading(true);
    setError('');

    try {
      if (nextIndex < results.length) {
        setIndex(nextIndex);
        await loadCandidate(results, nextIndex);
      } else {
        await loadCandidates();
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
          Review public GitHub profiles one at a time. Save the people worth a second look and keep moving.
        </p>
      </div>

      {error ? (
        <div className='status-panel' role='alert'>
          <strong>Couldn&apos;t load candidates.</strong>
          <span>{error}</span>
          <button type='button' className='primary-button' onClick={() => void loadCandidates()}>
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
