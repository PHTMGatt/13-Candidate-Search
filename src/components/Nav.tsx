import { Link, useLocation } from 'react-router-dom';
import { IoPeopleOutline, IoSearchOutline } from 'react-icons/io5';

const Nav = () => {
  const currentPage = useLocation().pathname;

  return (
    <header className='site-header'>
      <Link to='/' className='brand' aria-label='Candidate Scout home'>
        <span className='brand-mark'>CS</span>
        <span>
          <strong>Candidate Scout</strong>
          <small>GitHub talent discovery</small>
        </span>
      </Link>

      <nav className='nav-links' aria-label='Primary navigation'>
        <Link to='/' className={currentPage === '/' ? 'nav-link active' : 'nav-link'}>
          <IoSearchOutline aria-hidden='true' /> Search
        </Link>
        <Link
          to='/SavedCandidates'
          className={currentPage === '/SavedCandidates' ? 'nav-link active' : 'nav-link'}
        >
          <IoPeopleOutline aria-hidden='true' /> Shortlist
        </Link>
      </nav>
    </header>
  );
};

export default Nav;
