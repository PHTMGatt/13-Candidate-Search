import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';
import CandidateCard from '../components/CandidateCard';

const CandidateSearch = () => {
  const [results, setResults] = useState<Candidate[]>([])

  const [resultingCandidate, setResultingCandidate] = useState<Candidate>({
    id: null,
    name: null,
    login: null,
    location: null,
    avatar_url: null,
    email: null,
    html_url: null,
    company: null,
    bio: null,
  })

  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    searchForUsers()
    // searchForSpecificCandidate(resultingCandidate.login || '')

  },[])

  const searchForSpecificCandidate = async (user: string) => {
    const data: Candidate = await searchGithubUser(user)
    const { id, name, login, location, avatar_url, email, html_url, company, bio } = data
    setResultingCandidate({ id, name, login, location, avatar_url, email, html_url, company, bio })
    console.log(resultingCandidate)
  }
  
  const searchForUsers = async () => {
    const data: Candidate[] = await searchGithub()
    
    setResults(data)
    await searchForSpecificCandidate('jmo5896')
   // await searchForSpecificCandidate(data[index].login || '')
    
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
      await searchForSpecificCandidate(results[index + 1].login || '')
    }else {
      setIndex(0)
      await searchForUsers()
    }

  }


  return (
  <>
  CandidateSearch
  <CandidateCard resultingCandidate={resultingCandidate} selectCandidate={selectCandidate}/>
  
  </>
  )
};

export default CandidateSearch;
