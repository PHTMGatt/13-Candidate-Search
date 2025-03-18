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

  const selectCandidate = async (isSelected: boolean) => {
    if (isSelected) {
      let candidatesArray: Candidate[] = []
      const storedCandidates = localStorage.getItem('storedCandidates')
      if (typeof storedCandidates === 'string') {
        candidatesArray = JSON.parse(storedCandidates)
      }
      candidatesArray.push(resultingCandidate)
      localStorage.setItem('storedCandidates', JSON.stringify(candidatesArray))
    }

    if (index + 1 < results.length){
      setIndex(index + 1)
      await searchForSpecificCandidate(results[index + 1].userName || '')
    }else {
      setIndex(0)
      await searchForUsers()
    }

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
