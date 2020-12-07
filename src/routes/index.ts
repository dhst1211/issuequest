const express = require('express');
//import express from 'express';
const router = express.Router();
const { print } = require('graphql/language/printer');
const {
  starredRepositoriesQueryDesc, starredRepositoriesQueryAsc,
  repositoriesContributedToQuery, topRepositoriesQuery
} = require('../graphql/repo');
const issueQuery = require('../graphql/issue');
const { getRepoResult, getIssueResult } = require('../util/transformResult')

// return 401 for unaunthenticated request
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
    });
  } else {
    next();
  }
};

// return 200 for unaunthenticated request
router.get("/check", (req, res) => {
  const authenticated: boolean = typeof req.user !== 'undefined'

  res.status(200).json({
    authenticated,
  });
});

router.get("/repo", authCheck, async (req, res) => {
  
  const token: string = req.user.accessToken
  const after: string | null = req.query.staredReposEndCursor
  const queryType: string | null = req.query.queryType

  const graphQLQuery = (() => {
    switch (queryType) {
      case '1': return starredRepositoriesQueryDesc;
      case '2': return starredRepositoriesQueryAsc
      case '3': return repositoriesContributedToQuery
      case '4': return topRepositoriesQuery
      default: return starredRepositoriesQueryDesc
    }
  })();

  const apiResult = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    //body: JSON.stringify({ query }),
    body: JSON.stringify({ 
      query: `${print(graphQLQuery)}`,
      variables: { after }
    }),
  })

  const responseJson = await apiResult.json();
  const issueResult = getRepoResult(responseJson)

  res.status(200).json({
    repoData: responseJson,
    issueResult
  });
});

router.get("/repo/:name/:owner/issues", authCheck, async (req, res) => {

  const token: string = req.user.accessToken

  const { name, owner}: { name: string; owner: string } = req.params
  const apiResult = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    //body: JSON.stringify({ query }),
    body: JSON.stringify({ 
      query: `${print(issueQuery)}`,
      variables: { name, owner }
    }),
  })

  const responseJson = await apiResult.json();
  const issueResult = getIssueResult(responseJson)

  res.status(200).json({
    issueResult
  });
});

module.exports = router;
export {}
