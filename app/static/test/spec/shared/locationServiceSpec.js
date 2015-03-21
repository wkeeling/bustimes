'use strict';

describe("The stop locator", function() {

    it("should find nearest stop to me", function(done) {
        
        var nearestStop = null;
        
        getNearestStop(function(stop) {
            nearestStop = stop;
            console.log(stop.name);
            done();
        });
        
        // expect(nearestStop.name).toEqual('Hill Rise');
    });
}); 