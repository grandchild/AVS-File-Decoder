module.exports = function(grunt){

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    var jsFiles = [
        // maintain file order!
        'app/scripts/util.js',
        'app/scripts/files.js',
        'app/scripts/tables.js',
        'app/scripts/components.js',
        'app/scripts/convert.js',
        'app/scripts/main.js',
        'app/scripts/ui.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-value-double-quotes': true,
                    'doctype-first': true,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'head-script-disabled': true,
                    'style-disabled': true
                },
                src: ['index.html']
            }
        },

        // JavaScript
        /*
        jshint: {
            src: jsFiles
        },
        */

        uglify: {
            build: {
                options: {
                  mangle: false
                },
                src: jsFiles,
                dest: 'dist/scripts.min.js'
            }
        },

        // CSS
        cssmin: {
            build: {
                src: 'app/styles/**/*.css',
                dest: 'dist/styles.min.css'
            }
        },

        csslint: {
          strict: {
            src: 'app/styles/**/*.css'
          }
        },

        // Watch
        watch: {
            html: {
                files: ['index.html'],
                tasks: ['htmlhint']
            },
            js: {
                files: ['app/scripts/**/*.js'],
                tasks: ['uglify']
            },
            css: {
                files: ['app/styles/**/*.css'],
                tasks: ['csslint', 'cssmin']
            }
        }

    });

    grunt.registerTask('default', ['htmlhint', 'uglify', 'csslint', 'cssmin']);

};