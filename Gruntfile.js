module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            build: {
                src: ['src/*.js'],
                dest: 'fps-engine-dev.js'
            }
        },

        uglify: {
            my_target: {
                files: {
                    'fps-engine.js' : ['fps-engine-dev.js']
                }
            }
        },

        qunit : { 
            all : ['test/**/*.html']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-qunit');


    grunt.registerTask('default', ['concat']);
    grunt.registerTask('release', ['concat', 'uglify']);
    grunt.registerTask('test', ['qunit']);

};
