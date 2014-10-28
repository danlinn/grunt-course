/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/style.min.css'
      }
    },
    jshint: {
      // options: {
      //   curly: true,
      //   eqeqeq: true,
      //   immed: true,
      //   latedef: true,
      //   newcap: true,
      //   noarg: true,
      //   sub: true,
      //   undef: true,
      //   unused: true,
      //   boss: true,
      //   eqnull: true,
      //   browser: true,
      //   globals: {}
      // },
      customScript: {
        src: 'js/*.js'
      }
      // gruntfile: {
      //   src: 'Gruntfile.js'
      // },
      // lib_test: {
      //   src: ['lib/**/*.js', 'test/**/*.js']
      // }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    connect: {
      server: {
        options: {
          port: 9001,
          protocol: "http",
          hostname: "grunt.danmac.com",
          base: ".",
          directory: null,
          open: true,
          keepalive: true
        }
      }
    },
    concat: {
      prod: {
        src: ['css/**/*.css'],
        dest: 'process/site.css'
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: 'sass',
          cssDir: 'css',
          outputStyle: 'nested'
        }
      },
      prod: {
        options: {
          sassDir: 'sass',
          cssDir: 'css',
          outputStyle: 'compact',
          noLineComments: true
        }
      }
    },
    behat: {
      test: {
        options: {
          output: true,
          failOnUndefined: false,
          failOnFailed: true
        },
        cmd: 'vendor/bin/behat',
        features: 'features/',
        flags: '-f pretty'
      }
    },
    qunit: {
      all: {
        options: {
          urls: [
            'http://grunt.danmac.com/tests/index.html',
          ]
        }
      }
    },
    copy: {
      prod: {
        files: [
          {
            expand: true, // this enables some extra options
            cwd: 'process/', // this is the relative root
            src: ['**/*.css'], // the double star means all directories
                              // and the single means all files
            dest: 'dist/css',
            rename: function(dest, src) {
              return dest + "/" + src.substring(0, src.indexOf('.')) + '.prod.css';
            },
            flatten: true
          }
        ]
      },
      dev: {
        files: [
          {
            expand: true, // this enables some extra options
            cwd: 'css/', // this is the relative root
            src: ['**/*.css'], // the double star means all directories
                              // and the single means all files
            dest: 'dev/css',
            rename: function(dest, src) {
              return dest + "/" + src.substring(0, src.indexOf('.')) + '.dev.css';
            },
            flatten: true
          }
        ]
      }
    },
    cssmin: {
      prod: {
        files: [{
          expand: true,
          cwd: 'dist/css/',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css/',
          ext: '.min.css'
        }]
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,                // Enable dynamic expansion
          cwd: 'images/',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'images/'                  // Destination path prefix
        }]
      }
    },
    responsive_images: {
      myTask: {
        options: {
          sizes: [{
            width: 320,
            height: 240
          },{
            name: 'large',
            width: 640
          },{
            name: "large",
            width: 1024,
            suffix: "_x2",
            quality: 60
          }],
          engine: "im"
        },
        files: [{
          expand: true,
          cwd: "images",
          src: ['**/*.{jpg,gif,png}'],
          dest: 'dist/images'
        }]
      }
    },
    compress: {
      prod: {
        options: {
          archive: 'site.zip'
        },
        files: [
          {expand: true, src: ['dist/*'], dest: '/'}
        ]
      },
      dev: {
        options: {
          archive: 'dev.zip'
        },
        files: [
          {expand: true, src: ['dev/*'], dest: '/'}
        ]
      }
    },
    watch: {
      options : {
        livereload : true
      },
      // gruntfile: {
      //   files: '<%= jshint.gruntfile.src %>',
      //   tasks: ['jshint:gruntfile']
      // },
      // lib_test: {
      //   files: '<%= jshint.lib_test.src %>',
      //   tasks: ['jshint:lib_test', 'qunit']
      // },
      sass: {
        files: '**/*.scss',
        tasks: ['compass:dev']
      },
      css: {
        files: ['**/*.css']
      },
      images: {
        files: ['images/**/*.{png,jpg,gif}'],
        tasks: ['imagemin:dynamic']
      },
      responsive: {
        files: ['images/**/*.{png,jpg,gif}'],
        tasks: ['responsive_images']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-behat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat']);
  grunt.registerTask('test', ['jshint', 'qunit', 'behat']);
  grunt.registerTask('build', ['compass:prod','concat:prod','copy:prod', 'cssmin:prod', 'compress:prod']);
  grunt.registerTask('dev', ['compass:dev','copy:dev', 'compress:dev']);


};
