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
        }

    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');


    grunt.registerTask('default', ['requirejs'])

};
