'use strict';
module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        // setting folder templates
        dirs: {
            css: 'assets/css',
            images: 'assets/images',
            js: 'assets/js',
            src: 'assets/src',
            less: 'assets/less'
        },

        // Compile all .less files.
        less: {

            admin: {
                files: {
                    '<%= dirs.css %>/a2zpm.css': '<%= dirs.less %>/admin.less',
                }
            }
        },

        concat: {
            all_js: {
                files: {
                    '<%= dirs.js %>/a2zpm.js': [
                        '<%= dirs.src %>/start.js',
                        '<%= dirs.src %>/stores.js',
                        '<%= dirs.src %>/mixins/*.js',
                        '<%= dirs.src %>/components/**/*.js',
                        '<%= dirs.src %>/routes.js',
                        '<%= dirs.src %>/app.js',
                        '<%= dirs.src %>/end.js'
                    ],
                }
            }
        },

        // Generate POT files.
        makepot: {
            target: {
                options: {
                    exclude: ['build/.*', 'node_modules/*', 'assets/*'],
                    domainPath: '/languages/', // Where to save the POT file.
                    potFilename: 'a2zpm.pot', // Name of the POT file.
                    type: 'wp-plugin', // Type of project (wp-plugin or wp-theme).
                    potHeaders: {
                        'report-msgid-bugs-to': 'http://web-apps.ninja/support/',
                        'language-team': 'LANGUAGE <EMAIL@ADDRESS>'
                    }
                }
            }
        },

        uglify: {
            minify: {
                expand: true,
                cwd: '<%= dirs.js %>',
                src: [
                    'a2zpm.js'
                ],
                dest: '<%= dirs.js %>/',
                ext: '.min.js'
            }
        },

        watch: {
            less: {
                files: ['<%= dirs.less %>/*.less' ],
                tasks: ['less:admin']
            },

            js: {
                files: [
                    '<%= dirs.src %>/components/**/*.js',
                    '<%= dirs.src %>/mixins/*.js',
                    '<%= dirs.src %>/*.js'
                ],
                tasks: ['concat:all_js']
            }
        },

        // Clean up build directory
        clean: {
            main: ['build/']
        },

        // Copy the plugin into the build directory
        copy: {
            main: {
                src: [
                    '**',
                    '!node_modules/**',
                    '!.codekit-cache/**',
                    '!.idea/**',
                    '!build/**',
                    '!bin/**',
                    '!.git/**',
                    '!Gruntfile.js',
                    '!package.json',
                    '!composer.json',
                    '!composer.lock',
                    '!debug.log',
                    '!phpunit.xml',
                    '!.gitignore',
                    '!.gitmodules',
                    '!npm-debug.log',
                    '!export.sh',
                    '!config.codekit',
                    '!nbproject/*',
                    '!assets/less/**',
                    '!tests/**',
                    '!README.md',
                    '!CONTRIBUTING.md',
                    '!**/*~'
                ],
                dest: 'build/'
            }
        },

        //Compress build directory into <name>.zip and <name>-<version>.zip
        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: './build/a2zpm-v' + pkg.version + '.zip'
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*'],
                dest: 'a2z-project-manager'
            }
        },

    });


    // Load NPM tasks to be used here
    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-wp-i18n' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.registerTask( 'default', [
        'less',
        'concat'
    ] );

    grunt.registerTask( 'release', [
        'makepot',
        'less',
        'concat'
    ]);

    grunt.registerTask( 'zip', [
        'clean', 'copy', 'compress'
    ]);

};
