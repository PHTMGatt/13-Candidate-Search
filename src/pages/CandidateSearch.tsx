import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';
import CandidateCard from '../components/CandidateCard.tsx';

const CandidateSearch = () => {
  const [results, setResults] = useState<Candidate[]>([])

  const [resultingCandidate, setResultingCandidate] = useState<Candidate>({
    id: null,
    name: null,
    userName: null,
    location: null,
    avatarUrl: null,
    email: null,
    html_url: null,
    company: null,
  })


}
 

export default CandidateSearch;
