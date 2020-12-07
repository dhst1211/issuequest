"use strict";
var getIssueInfo = function (issues) {
    if (issues.totalCount == 0)
        return null;
    // limit to number of issues per repo
    var labeledIssueCount = issues.totalCount;
    var labeledIssuesList = issues.edges.map(function (issue) {
        var issueNode = issue.node;
        var noAssignees = issueNode.assignees.totalCount == 0;
        var issueNumber = issueNode.number;
        var title = issueNode.title;
        var url = issueNode.url;
        var publishedAt = issueNode.publishedAt.substring(0, 10);
        var updatedAt = issueNode.updatedAt.substring(0, 10);
        return {
            labeledIssueCount: labeledIssueCount, noAssignees: noAssignees, issueNumber: issueNumber, title: title, url: url, publishedAt: publishedAt, updatedAt: updatedAt
        };
    });
    return { labeledIssueCount: labeledIssueCount, labeledIssuesList: labeledIssuesList };
};
var getRepoResult = function (apiData) {
    // also return zero issue project for pagination UX
    var viewer = apiData.data.viewer;
    var starredRepositories = viewer.starredRepositories
        || viewer.repositoriesContributedTo
        || viewer.topRepositories;
    var starredRepoCount = starredRepositories.totalCount;
    var hasNextPage = starredRepositories.pageInfo.hasNextPage;
    var endCursor = starredRepositories.pageInfo.endCursor;
    var repos = starredRepositories.edges;
    var issuesPerRepo = repos.filter(function (repo) { return repo != null; }).map(function (repo) {
        var _a, _b;
        var node = repo.node;
        var goodFirstIssuesCount = node.good_first_issues.totalCount;
        var helpWantedIssueCount = node.help_wanted_issue.totalCount;
        var nameWithOwner = node.nameWithOwner;
        var primaryLanguage = node.primaryLanguage;
        var stargazersCount = node.stargazers.totalCount;
        var homepageUrl = node.homepageUrl;
        var languages = node.languages.nodes.map(function (n) { return n.name; });
        var location = (_a = node.owner) === null || _a === void 0 ? void 0 : _a.location;
        var repositoryTopics = node.repositoryTopics.nodes.map(function (n) { return n.topic.name; });
        var url = node.url;
        var name = node.name;
        var owner = (_b = node.owner) === null || _b === void 0 ? void 0 : _b.login;
        if (goodFirstIssuesCount == 0 && helpWantedIssueCount == 0) {
            return { hasLabeledIssue: false, nameWithOwner: nameWithOwner, primaryLanguage: primaryLanguage, stargazersCount: stargazersCount };
        }
        var goodFirstIssuesObj = getIssueInfo(node.good_first_issues);
        var helpWantedIssueObj = getIssueInfo(node.help_wanted_issue);
        return {
            hasLabeledIssue: true,
            nameWithOwner: nameWithOwner, primaryLanguage: primaryLanguage, stargazersCount: stargazersCount, goodFirstIssuesObj: goodFirstIssuesObj, helpWantedIssueObj: helpWantedIssueObj,
            homepageUrl: homepageUrl, languages: languages, location: location, repositoryTopics: repositoryTopics, url: url, name: name, owner: owner
        };
    });
    return { starredRepoCount: starredRepoCount, hasNextPage: hasNextPage, endCursor: endCursor, issuesPerRepo: issuesPerRepo };
};
var getIssueResult = function (apiResult) {
    var goodFirstIssues = getIssueInfo(apiResult.data.repository.good_first_issues);
    var helpWantedIssues = getIssueInfo(apiResult.data.repository.help_wanted_issue);
    return { goodFirstIssues: goodFirstIssues, helpWantedIssues: helpWantedIssues };
};
exports.getRepoResult = getRepoResult;
exports.getIssueResult = getIssueResult;
//# sourceMappingURL=transformResult.js.map