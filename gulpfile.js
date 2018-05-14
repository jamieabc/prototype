const gulp = require("gulp");
const sass = require("gulp-sass");
const changed = require("changed");
const grep = require("gulp-grep");
const browserSync = require("browser-sync");
const concat = require("gulp-concat");
const newer = require("gulp-newer");

const paths = {
  dest: {
    default: "./build",
    images: "./build/images"
  },
  src: {
    sass: ["./assets/**/*.scss"],
    images: "./assets/img/**/*",
    index: "./",
    html: "./webapp/**/*.html"
  }
};

gulp.task("sass", () => {
  return gulp
    .src(paths.src.sass)
    .pipe(sass())
    .pipe(gulp.dest(paths.dest.default))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("img:copy", () => {
  return gulp
    .src(paths.src.images)
    .pipe(newer(paths.dest.images))
    .pipe(gulp.dest(paths.dest.images));
});

gulp.task("server", () => {
  browserSync.init({
    server: { baseDir: [paths.src.index, paths.src.html, paths.dest.default] },
    browser: "google chrome"
  });
});

gulp.task("watch", () => {
  gulp.watch(paths.src.sass, gulp.series("sass"));
  gulp.watch(paths.images, gulp.series("img:copy"));
  gulp.watch([paths.src.index, paths.src.html]).on("change", browserSync.reload);
});

gulp.task("default", gulp.parallel("sass", "img:copy", "watch", "server"));
