describe('Manhandling promises', function() {
  var $brokenPromise, $rootScope;
  beforeEach(module('cheap.promises', function() {
  }));
  
  beforeEach(inject(function(_brokenPromise_, _$rootScope_) {
    $brokenPromise = _brokenPromise_;
    $rootScope = _$rootScope_;
  }));
  
  it('can return inside a promise', function(){
    var expectedData = 'broken';
    var result; 
    
    $brokenPromise.promiseMeSomethingCool()
      .then(function (data){
        result = data;
      });
    $rootScope.$apply();
    
    expect(result).toEqual(expectedData);
  })
  it('can haz vanilla', function(){
    var expectedData = 'broken';
    var result; 
    
    $brokenPromise.promiseMeSomethingRegular()
      .then(function (data){
        result = data;
      });
    $rootScope.$apply();
    
    expect(result).toEqual(expectedData);
  })
});