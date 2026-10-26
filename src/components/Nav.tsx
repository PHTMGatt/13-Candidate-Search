import { NavLink } from 'react-router-dom';
import { IoBookmarkOutline, IoPeopleOutline, IoSearchOutline } from 'react-icons/io5';

const Nav = () => (
  <header className='site-header'>
    <NavLink to='/' className='brand' aria-label='Candidate Scout home'>
      <span className='brand-mark'>CS</span>
      <span className='brand-copy'>
        <strong>Candidate <em>Scout</em></strong>
        <small>GitHub Talent Discovery</small>
      </span>
    </NavLink>

    <nav className='nav-links' aria-label='Primary navigation'>
      <NavLink to='/' end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
        <IoSearchOutline aria-hidden='true' /> Search
      </NavLink>
      <NavLink to='/shortlist' className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
        <IoPeopleOutline aria-hidden='true' /> Shortlist
      </NavLink>
      <NavLink to='/saved' className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
        <IoBookmarkOutline aria-hidden='true' /> Saved
      </NavLink>
    </nav>
  </header>
);

export default Nav;
