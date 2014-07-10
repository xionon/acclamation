module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    concat: {
      options: {
        separator: ';'
      },
      all: {
        src: [
          "bower_components/jquery/dist/jquery.min.js",
          "tmp/_uglified_javascript/**/*.js"
        ],
        dest: "dist/static/<%= pkg.name %>.js"
      }
    },

    uglify: {
      options: {
        banner: "/*! Compiled at <%= grunt.template.today(\"yyyy-mm-dd HH:MM:ss\") %> */\n",
      },
      package: {
        files: [{
          expand: true,
          src: "src/static/**/*.js",
          dest: "tmp/_uglified_javascript"
        }]
      },
      package_dev: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
        },
        files: [{
          expand: true,
          src: "src/static/**/*.js",
          dest: "tmp/_uglified_javascript"
        }]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("assets:install", ["uglify:package", "concat:all"]);
  grunt.registerTask("assets:install:dev", ["uglify:package_dev", "concat:all"]);
};
