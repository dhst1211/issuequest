const getIssueInfo = (issues): object | null => {

  if(issues.totalCount == 0) return null
  // limit to number of issues per repo
  const labeledIssueCount: number = issues.totalCount 
  const labeledIssuesList: Array<object> = issues.edges.map(issue => {
    const issueNode = issue.node

    const noAssignees: boolean = issueNode.assignees.totalCount == 0
    const issueNumber: number = issueNode.number
    const title: string = issueNode.title
    const url: string = issueNode.url
    const publishedAt: string = issueNode.publishedAt.substring(0,10)
    const updatedAt: string = issueNode.updatedAt.substring(0,10)

    return {
      labeledIssueCount, noAssignees, issueNumber, title, url, publishedAt, updatedAt
    }

  })

  return { labeledIssueCount, labeledIssuesList }
}

const getRepoResult = (apiData) => {
  // also return zero issue project for pagination UX
  const viewer = apiData.data.viewer
  const starredRepositories = viewer.starredRepositories
    || viewer.repositoriesContributedTo
    || viewer.topRepositories

  const starredRepoCount: number = starredRepositories.totalCount
  const hasNextPage: boolean = starredRepositories.pageInfo.hasNextPage
  const endCursor: string = starredRepositories.pageInfo.endCursor

  const repos: Array<any> = starredRepositories.edges

  const issuesPerRepo = repos.filter(repo => repo != null).map(repo =>{
    const node = repo.node
    const goodFirstIssuesCount: number = node.good_first_issues.totalCount
    const helpWantedIssueCount: number = node.help_wanted_issue.totalCount
    const nameWithOwner: string = node.nameWithOwner
    const primaryLanguage: string = node.primaryLanguage
    const stargazersCount: number = node.stargazers.totalCount

    const homepageUrl: string = node.homepageUrl
    const languages: string[] = node.languages.nodes.map(n => n.name)
    const location: string = node.owner?.location
    const repositoryTopics: string[] = node.repositoryTopics.nodes.map(n => n.topic.name)
    const url: string = node.url

    const name: string = node.name
    const owner: string = node.owner?.login

    if(goodFirstIssuesCount == 0 && helpWantedIssueCount == 0){
      return { hasLabeledIssue: false, nameWithOwner, primaryLanguage, stargazersCount }
    }

    const goodFirstIssuesObj: object | null = getIssueInfo(node.good_first_issues)
    const helpWantedIssueObj: object | null = getIssueInfo(node.help_wanted_issue)

    return {
      hasLabeledIssue: true, nameWithOwner, primaryLanguage, stargazersCount, goodFirstIssuesObj, helpWantedIssueObj,
      homepageUrl, languages, location, repositoryTopics, url, name, owner
    }
  })


  return { starredRepoCount, hasNextPage, endCursor, issuesPerRepo};
};

const getIssueResult = (apiResult) => {
  const goodFirstIssues = getIssueInfo(apiResult.data.repository.good_first_issues)
  const helpWantedIssues = getIssueInfo(apiResult.data.repository.help_wanted_issue)
  
  return { goodFirstIssues, helpWantedIssues }
}

exports.getRepoResult = getRepoResult;
exports.getIssueResult = getIssueResult;
