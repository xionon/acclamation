module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    concat: {
      options: {
        separator: ";\n"
      },
      "javascript": {
        src: [
          "bower_components/jquery/dist/jquery.min.js",
          "bower_components/chartjs/Chart.min.js",
          "tmp/_minified_javascript/**/*.js"
        ],
        dest: "dist/static/<%= pkg.name %>.js"
      },
      "javascript_dev": {
        src: [
          "bower_components/jquery/dist/jquery.min.js",
          "bower_components/chartjs/Chart.min.js",
          "src/static/**/*.js"
        ],
        dest: "dist/static/<%= pkg.name %>.js"
      },
      "stylesheets": {
        src: [
          "tmp/_minified_stylesheets/**/*.css"
        ],
        dest: "dist/static/<%= pkg.name %>.css"
      },
      "stylesheets_dev": {
        src: [
          "src/static/**/*.css"
        ],
        dest: "dist/static/<%= pkg.name %>.css"
      },
      "pure": {
        src: [
          "bower_components/pure/pure-min.css"
        ],
        dest: "dist/static/pure.css"
      },
      "pure_dev": {
        src: [
          "bower_components/pure/pure.css"
        ],
        dest: "dist/static/pure.css"
      }
    },

    uglify: {
      options: {
        banner: "/*! Compiled at <%= grunt.template.today(\"yyyy-mm-dd HH:MM:ss\") %> */\n",
      },
      "javascript": {
        files: [{
          expand: true,
          src: "src/static/**/*.js",
          dest: "tmp/_minified_javascript"
        }]
      }
    },

    cssmin: {
      minify: {
        expand: true,
        src: ["src/static/**/*.css"],
        dest: "tmp/_minified_stylesheets",
        ext: ".min.css"
      }
    },

    watch: {
      "javascript": {
        files: ["src/static/**/*.js"],
        tasks: ["assets:javascript:install"]
      },
      "javascript_dev": {
        files: ["src/static/**/*.js"],
        tasks: ["assets:javascript:install_dev"]
      },
      "stylesheets": {
        files: ["src/static/**/*.css"],
        tasks: ["assets:stylesheets:install"]
      },
      "stylesheets_dev": {
        files: ["src/static/**/*.css"],
        tasks: ["assets:stylesheets:install_dev"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("assets:javascript:install", ["uglify:javascript", "concat:javascript"]);
  grunt.registerTask("assets:javascript:install_dev", ["concat:javascript_dev"]);

  grunt.registerTask("assets:stylesheets:install", ["cssmin:minify", "concat:stylesheets", "concat:pure"]);
  grunt.registerTask("assets:stylesheets:install_dev", ["concat:stylesheets_dev", "concat:pure_dev"]);

  grunt.registerTask("assets:install", ["assets:javascript:install", "assets:stylesheets:install"]);
  grunt.registerTask("assets:install_dev", ["assets:javascript:install_dev", "assets:stylesheets:install_dev"]);

  grunt.registerTask("assets:watch", ["watch:javascript", "watch:stylesheets"]);
  grunt.registerTask("assets:watch_dev", ["watch:javascript_dev", "watch:stylesheets_dev"]);
};
