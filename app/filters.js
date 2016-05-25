angular.module('snippetFilters', []).filter('splicekeyword', function() {
  return function(inputElements, keyword) {
    var t0 = performance.now();
    
    if (!inputElements) return;
    if (!keyword) return inputElements;
    var keywords = keyword.toLowerCase().split(" ");
    
    var filteredElements = [];
    inputElements.forEach(function(item) {
        var hits = 0;
        var jsonstring = JSON.stringify(item).toLowerCase();
        keywords.forEach(function(needle) {
            hits += occurrences(jsonstring, needle);
        });

        if(hits){
            item.hits = hits;
            filteredElements.push(item);
        }
    });

    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
    return filteredElements.sort(byHitsDescending);
  };
});

/** Function count the occurrences of substring in a string;
* @param {String} string   Required. The string;
* @param {String} subString    Required. The string to search for;
* @param {Boolean} allowOverlapping    Optional. Default: false;
* @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
*/
function occurrences(string, subString, allowOverlapping) {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

function byHitsDescending(a,b) {
  if (a.hits < b.hits)
    return 1;
  else if (a.hits > b.hits)
    return -1;
  else 
    return 0;
}