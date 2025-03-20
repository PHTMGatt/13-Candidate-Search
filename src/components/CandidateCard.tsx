import type { Candidate } from '../interfaces/Candidate.interface'
import {IoAddCircle, IoRemoveCircle} from 'react-icons/io5'

type CandidateCardProps = {
    resultingCandidate: Candidate;
    selectCandidate: (isSelected: boolean) => void; 
}

const CandidateCard = ({resultingCandidate, selectCandidate}:CandidateCardProps) => {
  return (
    <div>
      {resultingCandidate?.login ? (
        <>
          {resultingCandidate?.avatar_url ? (
            <img
              src={`${resultingCandidate.avatar_url}`}
              alt={`Profile of ${resultingCandidate.login}`}
              style={{ width: '300px', borderRadius: '30px 30px 0 0' }}
            />
          ) : (
            <img
              src={'https://placehold.co/600x400'}
              alt={'Placeholder'}
              style={{ width: '300px', borderRadius: '30px 30px 0 0' }}
            />
          )}

          <section
            style={{
              backgroundColor: '#000',
              width: '280px',
              borderRadius: '0 0 30px 30px',
              padding: '0 10px 10px',
            }}
          >
            {resultingCandidate?.html_url && resultingCandidate?.login ? (
              <a href={resultingCandidate.html_url} target='_blank' rel='noreferrer'>
                <h2
                  style={{ padding: 0, margin: '-7px 0 0 0', color: 'white' }}
                >
                  {resultingCandidate.name}
                  <em>({resultingCandidate.login})</em>
                </h2>
              </a>
            ) : null}
            {resultingCandidate?.location ? (
              <p>Location: {resultingCandidate.location}</p>
            ) : null}
            {resultingCandidate?.email ? (
              <p>
                Email:{' '}
                <a href={`mailto:${resultingCandidate.email}`}>{resultingCandidate.email}</a>
              </p>
            ) : null}
            {resultingCandidate?.company ? (
              <p>Company: {resultingCandidate.company}</p>
            ) : null}
            {resultingCandidate?.bio ? <p>Bio: {resultingCandidate.bio}</p> : null}
          </section>
          <section
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <IoRemoveCircle
              style={{
                color: 'red',
                fontSize: '80px',
                cursor: 'pointer',
              }}
              onClick={() => selectCandidate(false)}
            />

            <IoAddCircle
              onClick={() => selectCandidate(true)}
              style={{
                fontSize: '80px',
                color: 'green',
                cursor: 'pointer',
              }}
            />
          </section>
        </>
      ) : (
        <h2>No Candidates at this time</h2>
      )}
    </div>
  )
}

export default CandidateCard