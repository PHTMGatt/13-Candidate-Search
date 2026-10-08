import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <section className='error-page'>
      <div>
        <span className='eyebrow'>404</span>
        <h1>That page wandered off.</h1>
        <p>The route you tried doesn&apos;t exist. Head back to Candidate Search and keep browsing.</p>
        <Link to='/' className='primary-button'>Back to search</Link>
      </div>
    </section>
  );
};

export default ErrorPage;
