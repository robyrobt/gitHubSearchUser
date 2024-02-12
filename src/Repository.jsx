import React, { useEffect, useState } from 'react';
import './App.css';
import { axiosService } from './axios';

function Repository({ repository, userName, errors }) {
  const [languages, setLanguages] = useState({});

  const fetchLanguages = async () => {
    if (errors?.notFound) return;

    try {
      const response = await axiosService.get(`/repos/${userName}/${repository.name}/languages`);
      setLanguages(response.data);
    } catch (error) {
      console.info(error);
    }
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
    </div>
  )
}

export default Repository