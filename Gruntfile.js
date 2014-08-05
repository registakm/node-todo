module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    path: {
      public: 'public',
      views: 'views'
    },
    watch: {
      compass: {
        files: ['<%= path.public %>/styles/_sass/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer', 'concat:scssset']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= path.views %>/{,*/}*.jade',
          '<%= path.public %>/styles/css/{,*/}*.css'
        ]
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
    },

    autoprefixer: {
      options: {
        browser: ['last 2 version', 'ie 8', "ie 9"]
      },
      dist: {
        files: [{
          src: '<%= path.public %>/styles/css/{,*/}*.css',
          dest: '<%= autoprefixer.dist.src%>'
        }]
      },
    },

    concurrent: {
      server: [
        'compass:server'
      ]
    },

    compass: {
      options: {
        config: "config.rb"
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    concat: {
      scssset: {
        src: '<%= path.public %>/styles/css/{,*/}*.css',
        dest: '<%= path.public %>/styles/css/style.css'
      },
      // jsset: {
      //   src: ["<%= path.public %>/js/lib/*.js", "<%= path.public %>/js/scripts/*.js"],
      //   dest: "<%= path.public %>/js/script.js"
      // }
    },


    csso: {
      dist: {
        files: [{
          src: '<%= path.public %>/styles/css/{,*/}*.css',
          dest: '<%= path.public %>/styles/css/{,*/}*.css'
        }]
      }
    },

    csscomb: {
      dist: {
        files: [{
          src: '<%= path.public %>/styles/css/{,*/}*.css',
          dest: '<%= path.public %>/styles/css/{,*/}*.css'
        }]
      }
    },

  });


  grunt.registerTask('serve', [
    'concurrent:server',
    'watch',
    'csscomb',
    'csso'
  ]);
};