module.exports = function(grunt) {
    var dev_target     = 'fps-engine-dev.js';
    var target         = 'fps-engine.js';
    var target_browser = 'google-chrome';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options : {
                // banner: "(function() {\n'use strict';\n",
                // footer: "})();"
            },
            build: {
                src: ['src/*.js'],
                dest: dev_target
            }
        },

        uglify: {
            my_target: {
                files: {
                    'fps-engine.js' : [dev_target]
                },
                mangle : true
            }
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                //unused: true, // TODO: put this back in later
                proto : true,
                browser: true,
                curly: true,
                undef: true,
                esnext: true,
                // strict: true,
                globals: {
                    webkitRequestAnimationFrame: true,
                    mozRequestAnimationFrame : true,
                    console : true,
                }
            },
            built: [dev_target],
            with_overrides: {
                options: {
                    curly: true,
                    undef: true,
                    devel: true,
                    browser: true,
                    esnext : true,
                    globals: {
                        QUnit : true,
                        expect : true,
                        KeyboardEvent : true,
                        // ALL THE OBJECTS - there's probably better way...
                        DebugConsole: true,
                        Player : true,
                        Map : true,
                        Pose: true,
                        InputManager : true,
                        loadJSON : true,
                        Renderer2D : true,
                        Renderer3D : true
                    }
                },
                files : {
                    test: ['test/*.js']
                },
            }
        },

        qunit : {
            all : ['test/*.html'],
            server_tests : {
                options : {
                    urls : ['http://localhost:8000/test/server_tests/MiscTests.html']
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.'
                }
            }
        },


        exec : {
           run         : target_browser + ' development.html',
           run_release : target_browser + ' production.html',
           clean       : 'rm ' + dev_target + ' ' + target,
           test_extra  : target_browser + ' test/InputManagerTests.html'
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');


    grunt.registerTask('default', ['concat', 'jshint']);
    grunt.registerTask('run', ['exec:run']);
    grunt.registerTask('run_release', ['exec:run_release']);
    grunt.registerTask('clean', ['exec:clean']);
    grunt.registerTask('release', ['concat', 'jshint', 'uglify']);
    grunt.registerTask('test', ['connect', 'qunit']);
    grunt.registerTask('test_extra', ['exec:test_extra']);

};
