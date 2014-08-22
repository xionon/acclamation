/* jshint camelcase: false */
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';\n'
      },
      'javascript': {
        src: [
          'bower_components/jquery/dist/jquery.min.js',
          'bower_components/chartjs/Chart.min.js',
          'tmp/_minified_javascript/**/*.js'
        ],
        dest: 'public/javascripts/<%= pkg.name %>.js'
      },
      'javascript_dev': {
        src: [
          'bower_components/jquery/dist/jquery.min.js',
          'bower_components/chartjs/Chart.min.js',
          'src/static/**/*.js'
        ],
        dest: 'public/javascripts/<%= pkg.name %>.js'
      },
      'stylesheets': {
        src: [
          'tmp/_minified_stylesheets/**/*.css'
        ],
        dest: 'public/stylesheets/<%= pkg.name %>.css'
      },
      'stylesheets_dev': {
        src: [
          'src/static/**/*.css'
        ],
        dest: 'public/stylesheets/<%= pkg.name %>.css'
      },
      'pure': {
        src: [
          'bower_components/pure/pure-min.css'
        ],
        dest: 'public/stylesheets/pure.css'
      },
      'pure_dev': {
        src: [
          'bower_components/pure/pure.css'
        ],
        dest: 'public/stylesheets/pure.css'
      }
    },

    uglify: {
      options: {
        banner: '/*! Compiled at <%= grunt.template.today(\'yyyy-mm-dd HH:MM:ss\') %> */\n',
      },
      'javascript': {
        files: [{
          expand: true,
          src: 'src/static/**/*.js',
          dest: 'tmp/_minified_javascript'
        }]
      }
    },

    cssmin: {
      minify: {
        expand: true,
        src: ['src/static/**/*.css'],
        dest: 'tmp/_minified_stylesheets',
        ext: '.min.css'
      }
    },

    watch: {
      'javascript': {
        files: ['src/static/**/*.js'],
        tasks: ['assets:javascript:install']
      },
      'javascript_dev': {
        files: ['src/static/**/*.js'],
        tasks: ['assets:javascript:install_dev']
      },
      'stylesheets': {
        files: ['src/static/*.css', 'src/static/**/*.css'],
        tasks: ['assets:stylesheets:install']
      },
      'stylesheets_dev': {
        files: ['src/static/*.css', 'src/static/**/*.css'],
        tasks: ['assets:stylesheets:install_dev']
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'config/**/*.js', 'spec/**/*.js'],
      options: {
        jshintrc: true
      }
    },

    jasmine_node: {
      options: {
        forceExit: true,
        extension: 'js',
        specNameMatcher: 'spec'
      },
      all: ['spec/']
    },

    shell: {
      start_redis: {
        command: 'redis-server',
        options: {
          async: true
        }
      },
      stop_redis: {
        command: 'pgrep redis-server | xargs kill'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-shell-spawn');

  grunt.registerTask('assets:javascript:install', ['uglify:javascript', 'concat:javascript']);
  grunt.registerTask('assets:javascript:install_dev', ['concat:javascript_dev']);

  grunt.registerTask('assets:stylesheets:install', ['cssmin:minify', 'concat:stylesheets', 'concat:pure']);
  grunt.registerTask('assets:stylesheets:install_dev', ['concat:stylesheets_dev', 'concat:pure_dev']);

  grunt.registerTask('assets:install', ['assets:javascript:install', 'assets:stylesheets:install']);
  grunt.registerTask('assets:install_dev', ['assets:javascript:install_dev', 'assets:stylesheets:install_dev']);

  grunt.registerTask('redis:start', ['shell:start_redis']);
  grunt.registerTask('redis:stop', ['shell:stop_redis']);

  grunt.registerTask('spec', ['redis:start', 'jasmine_node', 'redis:stop']);

  grunt.registerTask('check', ['spec', 'jshint']);
};
