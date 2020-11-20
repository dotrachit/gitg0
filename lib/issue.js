const axios = require('axios');
const gitRemoteOriginUrl = require('git-remote-origin-url');
var emoji = require('node-emoji');
const chalk = require('chalk');
var titleOfIssue;
let labelsOfIssue = [];

module.exports = {
    getIssue: (issueNumber) => {
        axios.get('https://api.github.com/users/dotrachit/repos')
            .then(async function (response) {
                for (repo in response.data) {
                    if (response.data[repo]['clone_url'] === (await gitRemoteOriginUrl())) {
                        var issueLink = response.data[repo]['issues_url'];
                        const finalIssueNumber = issueNumber.replace('#', '')
                        finalIssueLink = issueLink.
                            replace('{/number}', `/${finalIssueNumber}`)
                        axios.get(finalIssueLink)
                            .then(function (res) {
                                titleOfIssue = res.data['title'];
                                (res.data['labels']).forEach(element => {
                                    labelsOfIssue.push(element['name']);
                                });
                                console.log(emoji.get(':smiley_cat:'), chalk.bold('Github Issue Title:'), titleOfIssue);
                            })
                    }
                };
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }
}
