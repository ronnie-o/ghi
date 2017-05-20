const conf = require('./config.json');
const request = require('request');

function fetchMilestoneIssues(conf, m, callback) {
  const url = conf.API_BASE
              + '/repos/' + conf.ORG + '/' + conf.REPO + '/issues';

  request.get(
    {
      url: url,
      headers: {
        'User-Agent': 'ronnie-o',
        'Authorization': 'token ' + conf.ACCESS_TOKEN
      },
      qs: {
        milestone: m
      }
    },
    callback);
}

function onMilestoneIssue(error, response, body) {
  if (error) {
    return console.error('failed github api:', error);
  }

  var workText = '';
  JSON.parse(body).forEach(function (issue, index, array) {
    var assignees = getAssignees(issue.assignees);
    workText += '- ' + issue.title + assignees + '\n';
  });

  console.log(workText);
}

function getAssignees(assignees) {
  while (assignees.length > 0) {
    var assignee = issue.assignees.pop();
    assignees += ' @' + assignee.login;
  }
  return (assignees.length > 0) ? ' by ' + assignees : ' (unassigned)';
}

fetchMilestoneIssues(conf, process.argv[2], onMilestoneIssue);
