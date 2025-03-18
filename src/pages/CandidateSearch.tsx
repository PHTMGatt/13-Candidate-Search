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

  const [index, setIndex] = useState<number>(0)

  const searchForSpecificCandidate = async (user: string) => {
    const data: Candidate = await searchGithubUser(user)
    setResultingCandidate(data)
  }

  const searchForUsers = async () => {
    const data: Candidate[] = await searchGithub()
    setResults(data)
    await searchForSpecificCandidate(data[index].userName || '')

  }


  useEffect(() => {
    searchForUsers()
    searchForSpecificCandidate(resultingCandidate.userName || '')

  })


  return (
  <>
  CandidateSearch
  <CandidateCard resultingCandidate={resultingCandidate} selectCandidate={selectCandidate}/>
  
  </>
  )
};

export default CandidateSearch;
