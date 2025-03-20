import {useEffect, useState} from 'react'
import type {Candidate} from '../interfaces/Candidate.interface'
import SavedCandidate from '../components/savedCandidates';
import { BiColor } from 'react-icons/bi';

const SavedCandidates = () => {
  const [potentialCandidates, setPotentialCandidates] = useState<Candidate[]>(
    []
  );

  useEffect(() => {
    const savedCandidates = localStorage.getItem('storedCandidates');
    let candidates: Candidate[] = [];
    if (typeof savedCandidates === 'string') {
      candidates = JSON.parse(savedCandidates);
    }
    setPotentialCandidates(candidates);
  }, []);

  const rejectCandidate = (id: number) => {
    let parsedCandidates: Candidate[] = [];
    const savedCandidates = localStorage.getItem('storedCandidates');
    if (typeof savedCandidates === 'string') {
      parsedCandidates = JSON.parse(savedCandidates);
    }
    parsedCandidates = parsedCandidates.filter(
      (person: Candidate) => person.id !== id
    );
    localStorage.setItem('storedCandidates', JSON.stringify(parsedCandidates));
    setPotentialCandidates(parsedCandidates);
  };

  return (
    <>
      <table className='table'>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Location</th>
          <th>Email</th>
          <th>Company</th>
          <th>Bio</th>
          <th>Reject</th>
        </tr>
      </thead>
      <tbody>
        {potentialCandidates.map((candidate) => (
          <SavedCandidate
            key={candidate.id}
            candidate={candidate}
            rejectCandidate={rejectCandidate}
          />
        ))}
      </tbody>
    </table>
    </>
  );
};

export default SavedCandidates;
