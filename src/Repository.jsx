import React, { useEffect, useState } from 'react';
import './App.css';
import { axiosService } from './axios';
import { isEmpty } from 'lodash';

function Repository({ repository, userName }) {

  const [languages, setLanguages] = useState({});

  const fetchLanguages = async () => {
    const response = await axiosService.get(`/repos/${userName}/${repository.name}/languages`);
    setLanguages(response.data);
  }

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <div className='repo-item'>
      <div className='repo-item-header'>
        <a href={repository.html_url} target='_blank'>{repository.name}</a>
        <span>{repository.visibility}</span>
      </div>
      <p>Languages</p>
      <div className='languages'>
        {Object.keys(languages).map(item => {
          return (
            <span key={item} className='language-item'>
              {item}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default Repository