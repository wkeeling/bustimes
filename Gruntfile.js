module.exports = function(grunt) {
    grunt.initConfig({
        connect : {
            server : {
                options : {
                    port : 8000,
                    hostname: '0.0.0.0',
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', [connect]);
};