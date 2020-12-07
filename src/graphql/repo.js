const gql = require('graphql-tag');

const issueFragment = gql`
  fragment ISSUE_FRAGMENT on Issue {
    title
    number
    url
    publishedAt
    updatedAt
    assignees {
      totalCount
    }
  }
`

const repoFragment = gql`
  fragment REPO_FRAGMENT on Repository {
    diskUsage
    forkCount
    homepageUrl
    isArchived
    good_first_issues: issues(first: 2, labels: "good first issue", states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}){
      edges {
        cursor
        node {
          ...ISSUE_FRAGMENT
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
    help_wanted_issue: issues(first: 2, labels: "help wanted", states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}){
      edges {
        cursor
        node {
          ...ISSUE_FRAGMENT
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
    first_timer_only_issue: issues(labels: "first-timers-only", states: OPEN){
      totalCount
    }
    up_for_grabs_issue: issues(labels: "up-for-grabs", states: OPEN){
      totalCount
    }
    no_assignee_issues: issues(filterBy: {assignee: null},states: OPEN){
      totalCount
    }
    open_issues: issues(first: 1, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}){
      edges {
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
    languages(first: 100, orderBy: {field: SIZE, direction: ASC}){
      totalCount
      nodes {
        name
      }
    }
    name
    nameWithOwner
    owner {
      ... on ProfileOwner {
        login
        location
      }
    }
    primaryLanguage {
      name
    }
    pushedAt
    updatedAt
    repositoryTopics(first: 100) {
      totalCount
      nodes {
        topic {
          name
        }
      }
    }
    shortDescriptionHTML
    stargazers {
      totalCount
    }
    url
  }
  ${issueFragment}
`;

const starredRepositoriesQueryDesc = gql`
  query($after: String) {
    viewer {
      name
      login
      repositoriesContributedTo(first: 1){
        edges {
          cursor
          node {
            ...REPO_FRAGMENT
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
        totalCount
      }
      starredRepositories(first: 10, after: $after, orderBy: {field: STARRED_AT, direction: DESC}) {
        edges {
          cursor
          node {
            ...REPO_FRAGMENT
          }
        }
        isOverLimit
        pageInfo {
          endCursor
          hasNextPage
        }
        totalCount
      }
      topRepositories(first: 1, orderBy: {field: STARGAZERS, direction: DESC}){
        edges {
          cursor
          node {
            name
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
        totalCount
      }
    }
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
  }
  ${repoFragment}
`;

const starredRepositoriesQueryAsc = gql`
  query($after: String) {
    viewer {
      name
      login
      starredRepositories(first: 10, after: $after, orderBy: {field: STARRED_AT, direction: ASC}) {
        edges {
          cursor
          node {
            ...REPO_FRAGMENT
          }
        }
        isOverLimit
        pageInfo {
          endCursor
          hasNextPage
        }
        totalCount
      }
    }
  }
  ${repoFragment}
`;

const repositoriesContributedToQuery = gql`
  query($after: String) {
    viewer {
      name
      login
      repositoriesContributedTo(first: 10, after: $after, orderBy: {field: STARGAZERS, direction: ASC}){
        edges {
          cursor
          node {
            ...REPO_FRAGMENT
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
        totalCount
      }
    }
  }
  ${repoFragment}
`;

const topRepositoriesQuery = gql`
  query($after: String) {
    viewer {
      name
      login
      topRepositories(first: 10, after: $after, orderBy: {field: STARGAZERS, direction: DESC}){
        edges {
          cursor
          node {
            ...REPO_FRAGMENT
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
        totalCount
      }
    }
  }
  ${repoFragment}
`;

module.exports = { 
  starredRepositoriesQueryDesc, starredRepositoriesQueryAsc,
  repositoriesContributedToQuery, topRepositoriesQuery
};
