module.exports = function(grunt){

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	var jsFiles = [
		// maintain file order!
        'src/js/util.js',
        'src/js/files.js',
        'src/js/tables.js',
        'src/js/components.js',
        'src/js/convert.js',
        'src/js/main.js',
        'src/js/ui.js'
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

        uglify: {
		    build: {
		    	options: {
			      mangle: false
			    },
		        src: jsFiles,
    			dest: 'build/scripts.min.js'
		    }
		},

		cssmin: {
            build: {
                src: 'src/css/**/*.css',
                dest: 'build/styles.min.css'
            }
        },

        watch: {
		    html: {
		        files: ['index.html'],
		        tasks: ['htmlhint']
		    },
		    js: {
		        files: ['src/js/**/*.js'],
		        tasks: ['uglify']
		    },
		    css: {
		        files: ['src/css/**/*.css'],
		        tasks: ['cssmin']
		    }
		}

    });

    grunt.registerTask('default', 'watch');

};