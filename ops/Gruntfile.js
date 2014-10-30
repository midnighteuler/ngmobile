// Modified from output of generator-ionic 0.6.1
// See https://github.com/diegonetto/generator-ionic/blob/master/README.md

// Author: MLSouza 2014-10-26
'use strict';

var _ = require('lodash');
var path = require('path');
var cordovaCli = require('cordova');
var spawn = require('child_process').spawn;
var srcBase = path.resolve('../src');
var opsDir = process.cwd();
var nodeModuleBase = path.resolve('./node_modules');

module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        projectSettings: {
            // configurable paths
            app: srcBase + '/app',
            scripts: 'modules',
            styles: '/styles',
            images: '/images'
        },

        // Environment Variables for Angular App
        // This creates an Angular Module that can be injected via ENV
        // Add any desired constants to the ENV objects below.
        // https://github.com/diegonetto/generator-ionic#environment-specific-configuration
        ngconstant: {
            options: {
                space: '  ',
                wrap: '"use strict";\n\n {%= __ngModule %}',
                name: 'config',
                dest: '<%= projectSettings.app %>/modules/config.js'
            },
            development: {
                constants: {
                    ENV: {
                        name: 'development',
                        apiEndpoint: 'http://dev.yoursite.com:10000/'
                    }
                }
            },
            production: {
                constants: {
                    ENV: {
                        name: 'production',
                        apiEndpoint: 'http://api.yoursite.com/'
                    }
                }
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep', 'newer:copy:app']
            },
            html: {
                files: ['<%= projectSettings.app %>/**/*.html'],
                tasks: ['newer:copy:app']
            },
            js: {
                files: ['<%= projectSettings.app %>/<%= projectSettings.scripts %>/**/*.js'],
                tasks: ['newer:copy:app', 'newer:jshint:all']
            },
            compass: {
                files: ['<%= projectSettings.app %>/**/*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer', 'newer:copy:tmp']
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['ngconstant:development', 'newer:copy:app']
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            dist: {
                options: {
                    base: srcBase + '/www'
                }
            },
            coverage: {
                options: {
                    port: 9002,
                    open: true,
                    base: ['coverage']
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= projectSettings.app %>/<%= projectSettings.scripts %>/**/*.js'
            ],
            test: {
                options: {
                    jshintrc: srcBase + '/test/.jshintrc'
                },
                src: [srcBase + '/test/unit/**/*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        srcBase + '/www/*',
                        '!' + srcBase + '/www/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/<%= projectSettings.styles %>/',
                    src: '{,*/}*.css',
                    dest: '.tmp/<%= projectSettings.styles %>/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= projectSettings.app %>/index.html'],
                ignorePath: /\.\.\//
            }
        },
        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= projectSettings.app %>/modules',
                cssDir: '.tmp/<%= projectSettings.styles %>',
                generatedImagesDir: '.tmp/<%= projectSettings.images %>/generated',
                imagesDir: '<%= projectSettings.app %>/<%= projectSettings.images %>',
                javascriptsDir: '<%= projectSettings.app %>/<%= projectSettings.scripts %>',
                fontsDir: '<%= projectSettings.app %>/<%= projectSettings.styles %>/fonts',
                importPath: '<%= projectSettings.app %>/lib',
                httpImagesPath: '/<%= projectSettings.images %>',
                httpGeneratedImagesPath: '/<%= projectSettings.images %>/generated',
                httpFontsPath: '/<%= projectSettings.styles %>/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: srcBase + '/www/<%= projectSettings.images %>/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= projectSettings.app %>/index.html',
            options: {
                dest: srcBase + '/www',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on the useminPrepare configuration
        usemin: {
            html: [srcBase + '/www/**/*.html'],
            css: [srcBase + '/www/<%= projectSettings.styles %>/**/*.css'],
            options: {
                assetsDirs: [srcBase + '/www']
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        cssmin: {
            options: {
                root: '<%= projectSettings.app %>',
                noRebase: true
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: srcBase + '/www',
                    src: ['*.html', 'modules/**/*.html'],
                    dest: srcBase + '/www'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= projectSettings.app %>',
                    dest: srcBase + '/www',
                    src: [
                        '<%= projectSettings.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '*.html',
                        '<%= projectSettings.app %>/modules/**/*.tpl.html',
                        'fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/<%= projectSettings.images %>',
                    dest: srcBase + '/www/<%= projectSettings.images %>',
                    src: ['generated/*']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= projectSettings.app %>/<%= projectSettings.styles %>',
                dest: '.tmp/<%= projectSettings.styles %>/',
                src: '{,*/}*.css'
            },
            fonts: {
                expand: true,
                cwd: '<%= projectSettings.app %>/lib/ionic/release/fonts/',
                dest: '<%= projectSettings.app %>/fonts/',
                src: '*'
            },
            vendor: {
                expand: true,
                cwd: '<%= projectSettings.app %>/vendor',
                dest: '.tmp/<%= projectSettings.styles %>/',
                src: '{,*/}*.css'
            },
            app: {
                expand: true,
                cwd: '<%= projectSettings.app %>',
                dest: srcBase + '/www/',
                src: [
                    '**/*',
                    '!**/*.(scss,sass,css)',
                    '!**/*.spec.js'
                ]
            },
            tmp: {
                expand: true,
                cwd: '.tmp',
                dest: srcBase + '/www/',
                src: '**/*'
            }
        },

        concurrent: {
            ionic: {
                tasks: [],
                options: {
                    logConcurrentOutput: true
                }
            },
            server: [
                'compass:server',
                'copy:styles',
                'copy:vendor',
                'copy:fonts'
            ],
            test: [
                'compass',
                'copy:styles',
                'copy:vendor',
                'copy:fonts'
            ],
            dist: [
                'compass:dist',
                'copy:styles',
                'copy:vendor',
                'copy:fonts'
            ]
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       'www/<%= projectSettings.styles %>/main.css': [
        //         '.tmp/<%= projectSettings.styles %>/**/*.css',
        //         '<%= projectSettings.app %>/<%= projectSettings.styles %>/**/*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       'www/<%= projectSettings.scripts %>/scripts.js': [
        //         'www/<%= projectSettings.scripts %>/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },

        // Test settings
        // These will override any config options in karma.conf.js if you create it.
        karma: {
            options: {
                basePath: '',
                frameworks: [ 'jasmine' ],
                files: [
                    '<%= projectSettings.app %>/lib/angular/angular.js',
                    '<%= projectSettings.app %>/lib/angular-animate/angular-animate.js',
                    '<%= projectSettings.app %>/lib/angular-sanitize/angular-sanitize.js',
                    '<%= projectSettings.app %>/lib/angular-ui-router/release/angular-ui-router.js',
                    '<%= projectSettings.app %>/lib/ionic/release/js/ionic.js',
                    '<%= projectSettings.app %>/lib/ionic/release/js/ionic-angular.js',
                    '<%= projectSettings.app %>/lib/angular-mocks/angular-mocks.js',
                    '<%= projectSettings.app %>/<%= projectSettings.scripts %>/**/*.js',
//                    srcBase + '/test/mock/**/*.js',
//                    srcBase + '/test/spec/**/*.js',
                    '<%= projectSettings.app %>/**/*.spec.js'
                ],
                autoWatch: false,
                reporters: ['dots', 'coverage'],
                port: 8080,
                singleRun: false,
                preprocessors: {
                    // Update this if you change the projectSettings config path
                    '../src/app/modules/**/*.js': [srcBase + '/coverage']
                },
                coverageReporter: {
                    reporters: [{
                        type: 'html',
                        dir: srcBase + '/coverage/'
                    }, {
                        type: 'text-summary'
                    }]
                }
            },
            unit: {
                // Change this to 'Chrome', 'Firefox', etc. Note that you will need
                // to install a karma launcher plugin for browsers other than Chrome.
                browsers: ['PhantomJS'],
                background: true
            },
            continuous: {
                browsers: ['PhantomJS'],
                singleRun: true,
            }
        },

        // ngAnnotate tries to make the code safe for minification automatically by
        // using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/<%= projectSettings.scripts %>',
                    src: '*.js',
                    dest: '.tmp/concat/<%= projectSettings.scripts %>'
                }]
            }
        }

    });

    grunt.registerTask('force', function(task){
        //var previous_force_state = grunt.option("force");

        grunt.option('force', true);
        grunt.task.run(task);
        //grunt.option("force", previous_force_state)
    });

    // Register tasks for all Cordova commands
    _.functions(cordovaCli).forEach(function(name) {
        grunt.registerTask(name, function() {
            process.chdir(srcBase);
            this.args.unshift(name.replace('cordova:', ''));
            // Handle URL's being split up by Grunt because of `:` characters
            if (_.contains(this.args, 'http') || _.contains(this.args, 'https')) {
                this.args = this.args.slice(0, -2).concat(_.last(this.args, 2).join(':'));
            }
            var done = this.async();
            var exec = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
            var cmd = path.resolve(nodeModuleBase + '/cordova/bin', exec);
            var flags = process.argv.splice(3);
            var child = spawn(cmd, this.args.concat(flags));
            child.stdout.on('data', function(data) {
                grunt.log.writeln(data);
            });
            child.stderr.on('data', function(data) {
                grunt.log.error(data);
            });
            child.on('close', function(code) {
                code = code ? false : true;
                done(code);
            });
            process.chdir(opsDir);
        });
    });

    // Since Apache Ripple serves assets directly out of their respective platform
    // directories, we watch all registered files and then copy all un-built assets
    // over to www/. Last step is running cordova prepare so we can refresh the ripple
    // browser tab to see the changes. Technically ripple runs `cordova prepare` on browser
    // refreshes, but at this time you would need to re-run the emulator to see changes.
    grunt.registerTask('ripple', ['wiredep', 'newer:copy:app', 'ripple-emulator']);
    grunt.registerTask('ripple-emulator', function() {
        grunt.config.set('watch', {
            all: {
                files: _.flatten(_.pluck(grunt.config.get('watch'), 'files')),
                tasks: ['newer:copy:app', 'prepare']
            }
        });

        var cmd = path.resolve(nodeModuleBase + '/ripple-emulator/bin', 'ripple');
        var child = spawn(cmd, ['emulate']);
        child.stdout.on('data', function(data) {
            grunt.log.writeln(data);
        });
        child.stderr.on('data', function(data) {
            grunt.log.error(data);
        });
        process.on('exit', function(code) {
            child.kill('SIGINT');
            process.exit(code);
        });

        return grunt.task.run(['watch']);
    });

    // Dynamically configure `karma` target of `watch` task so that
    // we don't have to run the karma test server as part of `grunt serve`
    grunt.registerTask('watch:karma', function() {
        var karma = {
            files: ['<%= projectSettings.app %>/<%= projectSettings.scripts %>/**/*.js',
                    '<%= projectSettings.app %>/<%= projectSettings.scripts %>/**/*.spec.js'],
            tasks: ['newer:jshint:test', 'karma:unit:run']
        };
        grunt.config.set('watch', karma);
        return grunt.task.run(['watch']);
    });

    // Wrap ionic-cli commands
    grunt.registerTask('ionic', function() {
        process.chdir(srcBase);
        var done = this.async();
        var script = path.resolve(nodeModuleBase + '/ionic/bin/', 'ionic');
        var flags = process.argv.splice(3);

        var child = spawn(script, this.args.concat(flags), {
            stdio: 'inherit'
        });
        child.on('close', function(code) {
            code = code ? false : true;
            done(code);
        });
        process.chdir(opsDir);
    });

    grunt.registerTask('test', [
        'force:clean',
        'concurrent:test',
        'autoprefixer',
        'karma:unit:start',
        'watch:karma'
    ]);

    grunt.registerTask('serve', function(target) {
        if (target === 'compress') {
            return grunt.task.run(['compress', 'ionic:serve']);
        }

        grunt.config('concurrent.ionic.tasks', ['ionic:serve', 'watch']);
        grunt.task.run(['init', 'concurrent:ionic']);
    });
    grunt.registerTask('emulate', function() {
        grunt.config('concurrent.ionic.tasks', ['ionic:emulate:' + this.args.join(), 'watch']);
        return grunt.task.run(['init', 'concurrent:ionic']);
    });
    grunt.registerTask('run', function() {
        grunt.config('concurrent.ionic.tasks', ['ionic:run:' + this.args.join(), 'watch']);
        return grunt.task.run(['init', 'concurrent:ionic']);
    });
    grunt.registerTask('build', function() {
        return grunt.task.run(['init', 'ionic:build:' + this.args.join()]);
    });

    grunt.registerTask('init', [
        'force:clean',
        'ngconstant:development',
        'wiredep',
        'concurrent:server',
        'autoprefixer',
        'newer:copy:app',
        'newer:copy:tmp'
    ]);

    grunt.registerTask('compress', [
        'force:clean',
        'ngconstant:production',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngAnnotate',
        'copy:dist',
        'cssmin',
        'uglify',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('coverage', [
        'karma:continuous',
        'connect:coverage:keepalive'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'karma:continuous',
        'compress'
    ]);
};