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

const query = gql`
  query($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner){
      good_first_issues: issues(first: 100, labels: "good first issue", states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}){
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
      help_wanted_issue: issues(first: 100, labels: "help wanted", states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}){
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
    }
  }
  ${issueFragment}
`;

module.exports = query;