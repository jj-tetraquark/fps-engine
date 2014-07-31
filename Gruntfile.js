module.exports = function(grunt) {
    var dev_target     = 'fps-engine-dev.js';
    var target         = 'fps-engine.js';
    var target_browser = 'google-chrome';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            build: {
                src: ['src/*.js'],
                dest: dev_target
            }
        },

        uglify: {
            my_target: {
                files: {
                    'fps-engine.js' : [dev_target]
                }
            }
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                proto : true
            },
            built: [dev_target],
            test : ['test/*.js']
        },

        qunit : { 
            all : ['test/**/*.html']
        },

        exec : {
           run  :        target_browser + ' development.html',
           run_release : target_browser + ' production.html',
           clean :       'rm ' + dev_target + ' ' + target
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');


    grunt.registerTask('default', ['concat', 'jshint']);
    grunt.registerTask('run', ['exec:run']);
    grunt.registerTask('run_release', ['exec:run_release']);
    grunt.registerTask('clean', ['exec:clean']);
    grunt.registerTask('release', ['concat', 'jshint', 'uglify']);
    grunt.registerTask('test', ['qunit']);

};
