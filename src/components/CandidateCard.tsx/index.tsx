import React from 'react'
import type { Candidate } from '../../interfaces/Candidate.interface'

type CandidateCardProps = {
    resultingCandidate: Candidate;
    selectCandidate: (isSelected: boolean) => void; 
}

const CandidateCard = ({resultingCandidate, selectCandidate}:CandidateCardProps) => {
  return (
    <div>index</div>
  )
}

export default CandidateCard