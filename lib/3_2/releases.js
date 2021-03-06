var logger = require('log4js').getLogger('releases');
/**
 * @module Release
 * @description
 * holds data about 3_2 releases
 *
 **/
var Release = require('../models').Release;

var data = [
    new Release(
        {
            'id': '3.2m8',
            'timestamp': new Date('Apr 21, 2015 07:35:00 PM').getTime(),
            'packages': [
                'http://cloudify-public-repositories.s3.amazonaws.com/cloudify-cli/3.2m8/cloudify-cli.tar.gz',
                'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/get-cloudify.py',
                'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m8-RELEASE/cloudify-windows-cli_3.2.0-m8-b178.exe',
                'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m8-RELEASE/cloudify-ubuntu-agent_3.2.0-m8-b178_amd64.deb',
                'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m8-RELEASE/cloudify-centos-final-agent_3.2.0-m8-b178_amd64.deb',
                'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m8-RELEASE/cloudify-debian-jessie-agent_3.2.0-m8-b178_amd64.deb',
                'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m8-RELEASE/cloudify-windows-agent_3.2.0-m8-b178_amd64.deb',
                '​http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m8-RELEASE/cloudify-ui_3.2.0-m8-b178_amd64.deb​',
                'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m8-RELEASE/Vagrantfile',
                'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m8-RELEASE/cloudify-docker_3.2.0-m8-b178.tar',
                'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m8-RELEASE/cloudify-docker-commercial_3.2.0-m8-b178.tar'],
            'availableOnPypi': [
                'Diamond plugin, command - pip install --pre cloudify-diamond-plugin',

                'Agent packager, command - pip install --pre cloudify-agent-packager'
            ],
            'qb': {
                'configuration': 'root/cosmo/branches/3.2.X/3.2m8'
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
        'id': '3.2m2',
        'timestamp': new Date('Jan 16, 2015 11:53:00').getTime(),
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
        'timestamp': new Date('Jan 2, 2015 11:53:00').getTime(),
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


exports.get = function (callback) {
    logger.trace('getting 3.2 releases');
    Release.init(data, callback);
};