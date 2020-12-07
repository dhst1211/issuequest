"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
//import express from 'express';
var router = express.Router();
var print = require('graphql/language/printer').print;
var _a = require('../graphql/repo'), starredRepositoriesQueryDesc = _a.starredRepositoriesQueryDesc, starredRepositoriesQueryAsc = _a.starredRepositoriesQueryAsc, repositoriesContributedToQuery = _a.repositoriesContributedToQuery, topRepositoriesQuery = _a.topRepositoriesQuery;
var issueQuery = require('../graphql/issue');
var _b = require('../util/transformResult'), getRepoResult = _b.getRepoResult, getIssueResult = _b.getIssueResult;
// return 401 for unaunthenticated request
var authCheck = function (req, res, next) {
    if (!req.user) {
        res.status(401).json({
            authenticated: false,
        });
    }
    else {
        next();
    }
};
// return 200 for unaunthenticated request
router.get("/check", function (req, res) {
    var authenticated = typeof req.user !== 'undefined';
    res.status(200).json({
        authenticated: authenticated,
    });
});
router.get("/repo", authCheck, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, after, queryType, graphQLQuery, apiResult, responseJson, issueResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.user.accessToken;
                after = req.query.staredReposEndCursor;
                queryType = req.query.queryType;
                graphQLQuery = (function () {
                    switch (queryType) {
                        case '1': return starredRepositoriesQueryDesc;
                        case '2': return starredRepositoriesQueryAsc;
                        case '3': return repositoriesContributedToQuery;
                        case '4': return topRepositoriesQuery;
                        default: return starredRepositoriesQueryDesc;
                    }
                })();
                return [4 /*yield*/, fetch('https://api.github.com/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': "Bearer " + token,
                        },
                        //body: JSON.stringify({ query }),
                        body: JSON.stringify({
                            query: "" + print(graphQLQuery),
                            variables: { after: after }
                        }),
                    })];
            case 1:
                apiResult = _a.sent();
                return [4 /*yield*/, apiResult.json()];
            case 2:
                responseJson = _a.sent();
                issueResult = getRepoResult(responseJson);
                res.status(200).json({
                    repoData: responseJson,
                    issueResult: issueResult
                });
                return [2 /*return*/];
        }
    });
}); });
router.get("/repo/:name/:owner/issues", authCheck, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, _a, name, owner, apiResult, responseJson, issueResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                token = req.user.accessToken;
                _a = req.params, name = _a.name, owner = _a.owner;
                return [4 /*yield*/, fetch('https://api.github.com/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': "Bearer " + token,
                        },
                        //body: JSON.stringify({ query }),
                        body: JSON.stringify({
                            query: "" + print(issueQuery),
                            variables: { name: name, owner: owner }
                        }),
                    })];
            case 1:
                apiResult = _b.sent();
                return [4 /*yield*/, apiResult.json()];
            case 2:
                responseJson = _b.sent();
                issueResult = getIssueResult(responseJson);
                res.status(200).json({
                    issueResult: issueResult
                });
                return [2 /*return*/];
        }
    });
}); });
module.exports = router;
//# sourceMappingURL=index.js.map