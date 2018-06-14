module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({

        clean: {
            build: ["build"]
        },

        copy: {
            css: {
                files: [{
                    expand: true,
                    src: [
                        "build/css/**"
                    ],
                    dest: "css"
                }]
            },

            build: {
                files: [{
                    expand: true,
                    src: [
                        "fonts/**/*.{woff,woff2}",
                        "img/**",
                       // "js/**",
                        "*.html",
                        "en/**"
                    ],
                    dest: "build"
                }]
            },

            html: {
                files: [{
                    expand: true,
                    src: [
                        "*.html",
                        "en/*.html"
                    ],
                    dest: "build"
                }]
            },

            js: {
                files: [{
                    expand: true,
                    src: ["js/**/*.js"],
                    dest: "build"
                }]
            },

            datajs: {
                files: [{
                    expand: true,
                    src: [
                        "data/**/*.js",
                        "data/**/*.json"
                    ],
                    dest: "build"
                }]
            }
        },

        less: {
            style: {
                files: {
                    "build/css/style.css": "less/style.less"
                }
            }
        },

        postcss: {
            options: {
                processors: [
                    require("autoprefixer")({browsers:
                        [
                            "last 1 version",
                            "last 2 Chrome versions",
                            "last 2 Firefox versions",
                            "last 2 Opera versions",
                            "last 2 Edge versions"
                        ]}),
                    require("css-mqpacker")({
                        sort: true
                    })
                ]
            },
            style: {src: "build/css/*.css"}
        },

        csso: {
            style: {
                options: {
                    report: "gzip"
                },
                files: {
                    "build/css/style.min.css": ["build/css/style.css"]
                }
            }
        },

        imagemin: {
            images: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    src: ["build/img/**/*.{png,jpg,gif}"]
                }]
            }
        },

        svgstore: {
            options: {
                svg: {
                    style: "display: none",
                    xmlns: "http://www.w3.org/2000/svg"
                }
            },
            symbols: {
                files: {
                    "build/img/symbols.svg": ["img/icons/*.svg"]
                }
            }
        },

        svgmin: {
            symbols: {
                files: [{
                    expand: true,
                    src: ["build/img/icons/*.svg"]
                }]
            }

        },

        watch: {
            html: {
                files: [
                        "*.html",
                        "en/*.html"
                        ],
                tasks: ["copy:html"]
            },

            style: {
                files: ["less/**/*.less"],
                tasks: ["less", "postcss", "csso"]
            },

            js: {
                files: ["js/**/*.js"],
                tasks: ["copy:js"]
            },

            datajs: {
                files: ["data/**/*.js"],
                tasks: ["copy:datajs"]
            },

            datajson: {
                files: ["data/**/*.json"],
                tasks: ["copy:datajson"]
            }
        },

        browserSync: {
            server: {
                bsFiles: {
                    src: ["build/*.html", "build/css/*css", "build/js/*.js", "build/data/*.js"]
                },
                options: {
                    watchTask: true,
                    server: "build/",
                }
            }
        },
    });

grunt.registerTask("serve", ["browserSync", "watch"]);
grunt.registerTask("symbols", ["svgmin", "svgstore"]);

grunt.registerTask("build", [
    "clean",
    "copy",
    "less",
    "postcss",
    "csso",
    "symbols",
    "imagemin"
]);
};