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
                    target : [dev_target]
                }
            }
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            built: [dev_target]
        },

        qunit : { 
            all : ['test/**/*.html']
        },

        exec : {
           run  :        target_browser + ' development.html',
           run_release : target_browser + ' production.html'
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
    grunt.registerTask('release', ['concat', 'jshint', 'uglify']);
    grunt.registerTask('test', ['qunit']);

};
