module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    yuidoc: {
      compile: {
        name: "oauthclient.js",
        version: "0.1",
        description: "oauth.js library util",
        url: "https://github.com/kinjouj/oauthclient.js",
        options: {
          paths: "lib",
          outdir: "doc"
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-yuidoc");

  var mochaRun = function(args, cb) {
    var mocha = grunt.util.spawn(
      {
        cmd: "mocha-phantomjs",
        args: args
      },
      cb
    );
    //mocha.stdout.pipe(process.stdout);
    mocha.stderr.pipe(process.stderr);

    return mocha;
  };

  grunt.registerTask(
    "test-mocha-phantomjs",
    "Run mocha-phantomjs",
    function() {
      var done = this.async();

      mochaRun(
        ["test/runner.html"],
        function(err, result, code) {
          console.log(result.stdout);

          done();
        }
      );
    }
  );

  grunt.registerTask(
    "test-mocha-phantomjs-coverage",
    "Run mocha-phantomjs -R json-cov",
    function() {
      var done = this.async();

      var mocha = mochaRun(
        ['-R', 'json-cov', 'test/runner.html' ],
        function(err, result, code) {
          var cov = grunt.util.spawn(
            { cmd: 'json2htmlcov' },
            function(err, result, code) {
              if (code === 0) {
                grunt.file.write("coverage.html", result.stdout);

                console.log("open file://" + require("path").resolve("coverage.html"));
              }

              done();
            }
          );

          cov.stdin.write(result.stdout);
          cov.stdin.end();
        }
      );
      mocha.stderr.pipe(process.stderr);
    }
  );

  grunt.registerTask(
    "jscoverage",
    "Run jscoverage",
    function() {
      var done = this.async();
      var jsc = grunt.util.spawn(
        {
          cmd: "jscoverage",
          args: ["lib"]
        },
        function(err, result, code) {
          done();
        }
      );
      jsc.stdout.pipe(process.stdout);
      jsc.stdout.pipe(process.stderr);
    }
  );

  grunt.registerTask("test", ["jscoverage", "test-mocha-phantomjs"]);
  grunt.registerTask("coverage", ["jscoverage", "test-mocha-phantomjs-coverage"]);
  grunt.registerTask("default", ["test", "coverage", "yuidoc"]);
};
