var logger = require('log4js').getLogger('releases');
/**
 * @module Release
 * @description
 * holds data about 3_2 releases
 *
 **/
var Release = require('../models').Release;

var data = [
    new Release({
        'id': '3.2m3'
    }),
    new Release({
        'id': 'latest_milestone'
    }),
    new Release({
        'id': '3.2m2',
        'packages': [
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m2-RELEASE/cloudify-ubuntu-agent_3.2.0-m2-b171_amd64.deb',
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m2-RELEASE/cloudify-components_3.2.0-m2-b171_amd64.deb',
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m2-RELEASE/cloudify-windows-agent_3.2.0-m2-b171_amd64.deb',
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m2-RELEASE/cloudify-centos-final-agent_3.2.0-m2-b171_amd64.deb',
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m2-RELEASE/cloudify-core_3.2.0-m2-b171_amd64.deb',
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m2-RELEASE/cloudify-windows-cli_3.2.0-m2-b171.exe',
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m2-RELEASE/cloudify-ui_3.2.0-m2-b171_amd64.deb',
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m2-RELEASE/cloudify-docker_3.2.0-m2-b171.tar'
        ],
        'qb': {
            'configuration': 'root/cosmo/branches/3.2.X/3.2m2'
        },
        'tickets': [
            {
                'id': 'known_issues',
                'url': 'https://cloudifysource.atlassian.net/secure/IssueNavigator.jspa?mode=hide&requestId=15182'
            },
            {
                'id': 'feature_improvement',
                'url': 'https://cloudifysource.atlassian.net/secure/IssueNavigator.jspa?mode=hide&requestId=15181'
            },
            {
                'id': 'bug_fixes',
                'url': 'https://cloudifysource.atlassian.net/secure/IssueNavigator.jspa?mode=hide&requestId=15180'
            },
            {
                'id': 'important_issues',
                'url': 'https://cloudifysource.atlassian.net/issues/?filter=15380​​'
            }
        ]
    }),
    new Release({
        'id': '3.2m1',
        'cli': [
            {
                'id': 'windows',
                'url': 'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m1-RELEASE/cloudify-windows-cli_3.2.0-m1-b170.exe​'
            }

        ],
        'packages': [
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m1-RELEASE/cloudify-core_3.2.0-m1-b170_amd64.deb',
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m1-RELEASE/cloudify-components_3.2.0-m1-b170_amd64.deb',
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m1-RELEASE/cloudify-ubuntu-agent_3.2.0-m1-b170_amd64.deb',
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m1-RELEASE/cloudify-centos-final-agent_3.2.0-m1-b170_amd64.deb',
            ' http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m1-RELEASE/cloudify-windows-agent_3.2.0-m1-b170_amd64.deb',
            'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m1-RELEASE/cloudify-ui_3.2.0-m1-b170_amd64.deb'

        ],
        'tickets': [
            {
                'id': 'known_issues',
                'url': 'https://cloudifysource.atlassian.net/secure/IssueNavigator.jspa?mode=hide&requestId=15182'
            },
            {
                'id': 'feature_improvement',
                'url': 'https://cloudifysource.atlassian.net/secure/IssueNavigator.jspa?mode=hide&requestId=15181'
            },
            {
                'id': 'bug_fixes',
                'url': 'https://cloudifysource.atlassian.net/secure/IssueNavigator.jspa?mode=hide&requestId=15180'
            },
            {
                'id': 'important_issues',
                'url': 'https://cloudifysource.atlassian.net/issues/?filter=15380​​'
            }
        ]
    })
];



exports.get = function( callback ){
    logger.trace('getting 3.2 releases');
    Release.init(data, callback);
};