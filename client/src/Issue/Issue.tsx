import React, { useState, useEffect } from 'react';

import './Issue.scss';

interface Props {
  issues: any;
  issueCount: number;
  name: string;
  fetchIssues: () => void;
  isIssuesNotLoaded: boolean;
}

const Issue: React.FC<Props> = (props) => {

  const { issues, name, issueCount, fetchIssues, isIssuesNotLoaded } = props;

  if(!issues) return null

  return (
    <nav className="panel issue">
      <p className="panel-heading has-text-centered is-uppercase issue-type">
        {name}
        <span className="tag is-light ml-3">
          {issueCount} issues
        </span>
        {isIssuesNotLoaded && <button onClick={fetchIssues}>Load more</button>}
      </p>
      {issues?.labeledIssuesList.map((issue => (
        <a className="panel-block issue-list" href={issue.url} target="_blank" rel="noopener noreferrer">
          <span className="issue-title">
            #{issue.issueNumber}: {issue.title}
          </span>
          {issue.noAssignees && <span className="tag is-light is-primary no-ssignee-tag">No Assignees</span>}
          <span className="updatedAt">update: {issue.updatedAt}</span>
          </a>
      )))}
    </nav>
  )
}

export default Issue;
