import { useEffect, useState } from 'react'
import './App.css'
import { axiosService } from './axios';
import { isEmpty } from 'lodash';
import Repository from './Repository';
import moment from 'moment';

function App() {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState({});
  const [userRepositories, setUserRepositories] = useState({});
  const [limit, setLimit] = useState({});
  const [errors, setErrors] = useState({});

  const onChangeUserName = (e) => {
    setUserName(e.target.value);
  }

  useEffect(() => {
    fetchLimit();
  }, []);

  const fetchLimit = async () => {
    const response = await axiosService.get(`/rate_limit`);

    if (response.data.rate.remaining <= 0) {
      setErrors({ limit: `The maximum number of requests per hour is exceeded (60 per hour). Reset Time: ${moment.unix(response.data.rate.reset).local().format("MM/DD/YYYY HH:MM:SS")}` })
      return;
    }
    setLimit(response.data);
  }

  const fetchUser = async () => {
    if (!userName || errors.limit) {
      setUser({});
      return;
    }

    try {
      const response = await axiosService.get(`/users/${userName}`);
      setUser(response.data);
    } catch (error) {
      if (error.response.status === 404) {
        setErrors({ notFound: "User Not Found" });
        setUser({});
      }
    }
  }

  const fetchUserRepositories = async () => {
    if (isEmpty(user)) return;

    try {
      const response = await axiosService.get(`/users/${userName}/repos`);
      setUserRepositories(response.data);
    } catch (error) {
      if (error.response.status === 404) {
        setErrors({ notFound: "Not Found" });
        setUserRepositories({});
      }
    }
  }

  const handleClick = (e) => {
    e.preventDefault();

    fetchUser();
    fetchUserRepositories();
  }

  const handlePressKey = (e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      fetchUser();
    }
  }

  return (
    <div className='app-container'>
      <div className='container'>
        <h1>GitHub User search</h1>
        <form className='form-action'>
          <input
            type='text'
            placeholder='User Name'
            className='username-input'
            name='username'
            onChange={onChangeUserName}
            onKeyUp={handlePressKey}
            defaultValue={userName}
          />
          <button
            type='submit'
            onClick={handleClick}
            className='search-button'
            disabled={limit.rate?.remaining === 0}
          >Find user</button>
        </form>
        {!isEmpty(errors) && <div className='errors'>
          {Object.values(errors).map(err => {
            return <p key={err} className='error'>{err}</p>
          })}
        </div>}
        {!isEmpty(user) && <section>
          <div style={{
            backgroundImage: `url(${user.avatar_url})`,
            height: '150px',
            width: '150px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '50%',
          }} />
          <h2>{user.name}</h2>
          <p><a href={user.html_url} target='_blank'>{user.login}</a></p>
          {user.company && <p>{user.company}</p>}

          <div className='user-repos'>
            <div className='repos'>
              {user.public_repos} Public Repositories
            </div>
          </div>
          {!isEmpty(userRepositories) && <div className='repositories'>
            {userRepositories.map(repo => {
              return (
                <Repository
                  key={repo.id}
                  repository={repo}
                  userName={userName}
                />
              )
            })}
          </div>}
        </section>}
      </div>
    </div>
  )
}

export default App
