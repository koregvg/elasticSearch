/**
 * Created by wangpai on 2016/12/10 0010.
 */
var gulp = require('gulp');

module.exports = function(tasks) {
    tasks.forEach(function(name) {
        gulp.task(name, require('./tasks/' + name));
    });

    return gulp;
};
