import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Issue from './Issue';
import './Repo.scss';

interface Props {
  repoIssue: any;
}

const Repo: React.FC<Props> = (props) => {

  const [goodFirstIssues, setGoodFirstIssues] = useState<any>(null);
  const [helpWantedIssues, setHelpWantedIssues] = useState<any>(null);
  const [isIssuesNotLoaded, setIsIssuesNotLoaded] = useState<boolean>(true);

  const { repoIssue } = props
  const { name, owner } = repoIssue

  const fetchIssues = () => {
    
    axios.get(`/repo/${name}/${owner}/issues`, {
    })
    .then(res => {
      setGoodFirstIssues(res.data.issueResult.goodFirstIssues);
      setHelpWantedIssues(res.data.issueResult.helpWantedIssues);
    })
    .catch((error) => {
      window.location.href = '/'
    });
    setIsIssuesNotLoaded(false)
  }

  if(!repoIssue.hasLabeledIssue){
    return (
      <div className="card mt-4">
        <header className="card-header">
          <p className="card-header-title card-header-title-no-issue">
            {repoIssue.nameWithOwner}
          </p>
        </header>
      </div>
    )
  } 

  return (
    <div className="card mt-4">
      <header className="card-header">
        <div className="card-header-title card-header-title-css">
          <a href={repoIssue.url} target="_blank" rel="noopener noreferrer">{repoIssue.nameWithOwner}</a>
          <span className="star"><i className="far fa-star star-icon"></i>{repoIssue.stargazersCount}</span>
          <div className="card-header-left">
            {repoIssue.location && <span className="location"><i className="fas fa-map-marker-alt"></i> {repoIssue.location}</span>}
            {repoIssue.homepageUrl && <a href={repoIssue.homepageUrl} target="_blank" rel="noopener noreferrer"><i className="fas fa-home"></i></a>}
          </div>
        </div>
      </header>
      <div className="card-content">
        <div className="content">
          <p>
            {repoIssue.primaryLanguage && repoIssue.primaryLanguage.name &&
              <span className="tag is-primary">Primary: {repoIssue.primaryLanguage.name}</span>} 
            {repoIssue.languages.map((lang: string) => (
              <span key={lang} className="tag is-primary is-light">{lang}</span>
            ))}
          </p>
          <Issue
            key={`${repoIssue.nameWithOwner}firstIssue`}
            issues={goodFirstIssues || repoIssue?.goodFirstIssuesObj}
            issueCount={repoIssue?.goodFirstIssuesObj?.labeledIssueCount}
            name="Good first issue"
            fetchIssues={fetchIssues}
            isIssuesNotLoaded={isIssuesNotLoaded}
          />
          <Issue
            key={`${repoIssue.nameWithOwner}helpWanted`}
            issues={helpWantedIssues || repoIssue?.helpWantedIssueObj}
            issueCount={repoIssue?.helpWantedIssueObj?.labeledIssueCount}
            name="Help wanted"
            fetchIssues={fetchIssues}
            isIssuesNotLoaded={isIssuesNotLoaded}
          />
        </div>
      </div>
    </div>
  );
}

export default Repo;
