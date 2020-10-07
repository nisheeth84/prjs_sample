const getDictionary = function() {
    return fetch("./dictionary/dictionary.json").then(function(response) {
        return response.json();
    }).then(function(json) {
        return json
    });
}

export default {
    'getDictionary': getDictionary
}
