import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { loadavg } from 'os';
import InfiniteScroll from 'react-infinite-scroll-component';

import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import DotLoader from "react-spinners/DotLoader";

import IssueRepo from './Issue/Repo'
import './Dashboard.scss';
import * as Const from './util/Const';

const ReposLoaderStyle = css`
  display: block;
  margin: 0 auto;
  margin-top: 10px;
  border-color: ${Const.PRIMARY_COLOR};
`;

const LoaderStyle = css`
  display: block;
  margin: 0 auto;
  border-color: ${Const.PRIMARY_COLOR};
`;

interface IMeta {
  starredRepoCount: number;
  hasNextPage: boolean;
  endCursor: string;
}

interface IRepo {
  repoData: object;
  issueResult: any;
}

enum QueryType {
  LAST_STARED = 1,
  FIRST_STARED = 2,
  CONTRIBUTED = 3,
  TOP = 4,
}

const Dashboard: React.FC = () => {

  const [meta, setMeta] = useState<IMeta | null>(null);
  const [issuesPerRepo, setIssuesPerRepo] = useState<any[]>([]);
  const [repo, setRepo] = useState<IRepo | null>(null);

  const [queryType, setQueryType] = useState<QueryType>(QueryType.LAST_STARED);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    axios.get('/repo')
      .then(res => {
        setRepo(res.data);
        setMeta({
          starredRepoCount: res.data.issueResult.starredRepoCount,
          hasNextPage: res.data.issueResult.hasNextPage,
          endCursor: res.data.issueResult.endCursor
        });
        setIssuesPerRepo(res.data.issueResult.issuesPerRepo)
      })
      .catch((error) => {
        window.location.href = '/'
      });
  }, []);

  const changeQueryType = (type: QueryType) => {
    setIsLoading(true)
    axios.get(`/repo?queryType=${type}`)
      .then(res => {
        setIsLoading(false)
        setQueryType(type);
        setRepo(res.data);
        setMeta({
          starredRepoCount: res.data.issueResult.starredRepoCount,
          hasNextPage: res.data.issueResult.hasNextPage,
          endCursor: res.data.issueResult.endCursor
        });
        setIssuesPerRepo(res.data.issueResult.issuesPerRepo)
      })
      .catch((error) => {
        window.location.href = '/'
      });
  }

  const loadMore = () => {
    axios.get(`/repo?queryType=${queryType}`, {
      params: {
        staredReposEndCursor: meta?.endCursor
      }
    })
    .then(res => {
      setRepo(res.data);
      setMeta({
        starredRepoCount: res.data.issueResult.starredRepoCount,
        hasNextPage: res.data.issueResult.hasNextPage,
        endCursor: res.data.issueResult.endCursor
      });
      setIssuesPerRepo([...issuesPerRepo, ...res.data.issueResult.issuesPerRepo])
    })
    .catch((error) => {
      window.location.href = '/'
    });
    return issuesPerRepo
  }

  const repoArea = () => {
    if(isLoading) return (
      <div className="loading-page">
        <DotLoader
          css={LoaderStyle}
          size={150}
          color={Const.PRIMARY_COLOR}
          loading={true}
        />
      </div>
    )

    return (
      <section className="section repos-section">
        <InfiniteScroll
          dataLength={issuesPerRepo.length}
          next={loadMore}
          hasMore={!!meta?.hasNextPage} // convert nullable boolean to boolean
          loader={
            <ClipLoader
              css={ReposLoaderStyle}
              size={30}
              color={Const.PRIMARY_COLOR}
              loading={!!meta?.hasNextPage}
            />
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>You’ve reached the end of the list</b>
            </p>
          }
        >
          {issuesPerRepo.map((repoIssue) => {
            return <IssueRepo key={repoIssue.nameWithOwner} repoIssue={repoIssue} />
          })}
        </InfiniteScroll>
      </section>
    )
  }

  if(!repo){
    return (
      <div className="loading-page">
        <DotLoader
          css={LoaderStyle}
          size={150}
          color={Const.PRIMARY_COLOR}
          loading={true}
        />
      </div>
    )
  }

  return (
    <div >
      <section className="hero is-primary is-bold">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Repositories
            </h1>
            <h2 className="subtitle">
              Total Count: {repo.issueResult.starredRepoCount}
            </h2>
          </div>
        </div>
      </section>
      <div className="tabs is-fullwidth">
        <ul>
          <li className={`${(queryType == QueryType.LAST_STARED) ? 'is-active' : ''}`}>
            <a onClick={() => changeQueryType(QueryType.LAST_STARED)}>
              <span className="icon is-small"><i className="fas fa-star" aria-hidden="true"></i></span>
              <span>Last Stared</span>
            </a>
          </li>
          <li className={`${(queryType == QueryType.FIRST_STARED) ? 'is-active' : ''}`}>
            <a onClick={() => changeQueryType(QueryType.FIRST_STARED)}>
              <span className="icon is-small"><i className="fas fa-star" aria-hidden="true"></i></span>
              <span>First Stared</span>
            </a>
          </li>
          <li className={`${(queryType == QueryType.CONTRIBUTED) ? 'is-active' : ''}`}>
            <a onClick={() => changeQueryType(QueryType.CONTRIBUTED)}>
              <span className="icon is-small"><i className="fas fa-code-branch" aria-hidden="true"></i></span>
              <span>Contributed</span>
            </a>
          </li>
          <li className={`${(queryType == QueryType.TOP) ? 'is-active' : ''}`}>
            <a onClick={() => changeQueryType(QueryType.TOP)}>
              <span className="icon is-small"><i className="fas fa-trophy" aria-hidden="true"></i></span>
              <span>Contribution Rank</span>
            </a>
          </li>
        </ul>
      </div>
      {repoArea()}
    </div>
  );
}

export default Dashboard;