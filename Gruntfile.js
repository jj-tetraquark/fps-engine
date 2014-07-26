module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs : {
            compile : {
                options : {
                    baseUrl : "src/",
                    mainConfigFile : "src/main.js",
                    name: "almond",
                    include : "main",
                    out : "fps-engine.js",
                    paths : {
                        almond : '../node_modules/almond/almond'
                    }
                }
            }
        },

        qunit : { 
            all : ['test/**/*.html']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-qunit');


    grunt.registerTask('default', ['requirejs'])
    grunt.registerTask('test', ['qunit']);

};
