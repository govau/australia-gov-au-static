/**
 * @file
 * GSE Search Toolkit JavaScript helpers.
 */

(function ($, Drupal, window, document, undefined) {
    // Solr autocomplete js helper.
    Drupal.behaviors.ausgov_search_autocomplete = {
        attach: function (context, settings) {
            $("div#topbar-search input[name='search_block_form']").solrcompletion({
                'enabled': 'enabled',
                'program': '/ausgov_search/autocomplete/',
                'show': '15',
                'length': '3',
                'delay': '0'
            });
        }
    };

    jQuery.extend({
        getCachedJSON: function (url, callback, localStorage) {
            if (Modernizr.localstorage && localStorage) {
                // window.localStorage is available!
                var cacheTimeInMs = 3600000;
                var currentTimeInMs = new Date().getTime();
                var cache = {
                    data: null,
                    timestamp: null
                };
                if (typeof window.localStorage[url] !== "undefined") {
                    cache = JSON.parse(window.localStorage[url]);
                    var validCache = (currentTimeInMs - cache.timestamp) < cacheTimeInMs;
                    if (validCache) {
                        callback(cache.data);
                        return true;
                    }
                }
                $.getJSON(url, function (data) {
                    cache.data = data;
                    cache.timestamp = new Date().getTime();

                    window.localStorage[url] = JSON.stringify(cache);

                    callback(cache.data);
                });
            } else {
                $.getJSON(url, function (data) {
                    callback(data);
                });
            }
        }
    });

    // Solr auto complete plugin.
    $.fn.solrcompletion = function (settings) {
        var config = {
            'show': 10,
            'delay': 0,
            'length': 3,
            'program': '',
            'enabled': 'disabled',
            'zindex': 1000,
            'top': '45px',
            'localStorage': false
        };

        if (settings) $.extend(config, settings);

        if (config.enabled != 'enabled') {
            return;
        }

        this.each(function () {
            var targetElement = this;

            $(targetElement).autocomplete({
                appendTo: ($("#siteSearchForm").length > 0) ? "#siteSearchForm" : "body",
                source: function (request, response) {
                    var go = jQuery.Deferred();
                    var keyword = request.term;
                    var suggestions = new Array();
                    var addSuggest = function (suggestion) {
                        if (suggestions.length == 0) {
                            suggestions.push(suggestion);
                        } else {
                            // Clean up data.
                            jQuery.each(suggestions, function (index, value) {
                                if (value.s.indexOf(suggestion.s) != -1) {
                                    suggestions.splice(index, 1);
                                    return false;
                                }
                            });
                            suggestions.push(suggestion);
                        }
                    };
                    var addSuggestData = function (suggestionData) {
                        suggestions = suggestions.concat(suggestionData);
                    };
                    // query Solr search for suggestions.
                    var querySolr = function (size) {
                        jQuery.ajax({
                            type: 'GET',
                            url: config.program
                            + '?partial_query=' + request.term.replace(/ /g, '+')
                            + '&show=' + size
                            ,
                            dataType: 'jsonp',
                            error: function (xhr, textStatus, errorThrown) {
                                if (window.console) {
                                    console.log('Autocomplete API error');
                                }
                            },
                            success: function (data) {
                                addSuggestData(data);
                                go.resolve(suggestions);
                            }
                        });
                    };

                    // Load data into json object array.
                    var loadSuggest = function (data) {
                        if (data.length > 0) {
                            jQuery.each(data, function (key, val) {
                                if (val.k.indexOf(keyword) != -1) {
                                    addSuggest(val);
                                }
                            });
                            var featureSize = suggestions.length;
                            var solrSize = config.show - featureSize;
                            if (solrSize > 0) {
                                querySolr(solrSize);
                            } else {
                                go.resolve(suggestions);
                            }
                        } else {
                            return false;
                        }
                    };

                    // Process data.
                    var prepareData = function (data) {
                        // Define variables.
                        var responses = new Array();
                        var categorized = new Array();
                        var categoryLabels = new Array();
                        var sorted = new Array();

                        for (var i = 0; i < data.length; i++) {
                            var suggestion = data[i];
                            if (suggestion == null) {
                                continue;
                            }

                            if (typeof(suggestion) == 'string') {
                                // Single string suggestion
                                responses.push({
                                    label: suggestion,
                                    matchOn: request.term
                                });
                            } else if (typeof(suggestion) == 'object') {
                                if (suggestion.c) {
                                    if (!categorized[suggestion.c]) {
                                        categorized[suggestion.c] = new Array();
                                        categoryLabels.push(suggestion.c);
                                    }
                                    var label = suggestion.s;
                                    categorized[suggestion.c].push({
                                        label: label,
                                        value: label,
                                        extra: suggestion,
                                        matchOn: request.term
                                    });
                                } else {
                                    responses.push({
                                        label: suggestion.s,
                                        value: suggestion.s,
                                        extra: suggestion,
                                        matchOn: request.term
                                    });
                                }
                            }
                        }

                        // Add categorized suggestions, with category header
                        for (var i = 0; i < categoryLabels.length; i++) {
                            var cLabel = categoryLabels[i];
//                                responses.push({
                            sorted.push({
                                label: cLabel,
                                category: true
                            });
                            for (var j = 0; j < categorized[cLabel].length; j++) {
//                                    responses.push(categorized[cLabel][j]);
                                sorted.push(categorized[cLabel][j]);
                            }
                        }

                        // Add heading for organic suggestions
                        if (responses.length > 0) {
                            sorted.push({
                                label: "Suggestions",
                                category: true
                            });

                            for (var i = 0; i < responses.length; i++) {
                                sorted.push(responses[i]);
                            }
                        }
                        if (sorted.length > 0) {
                            sorted.push({
                                label: '<div id="qcmore">Search australia.gov.au for ' + request.term + '</div>',
                                value: request.term,
                                //extra: suggestion,
                                matchOn: request.term
                            });
                        }
                        response(sorted);
                    };

                    jQuery.when(go).then(function (suggestions) {
                        if (suggestions.length > 0) {
                            // Sort results.
                            suggestions.sort(function (a, b) {
                                return parseFloat(b.w) - parseFloat(a.w);
                            });
                            prepareData(suggestions);
                        } else {
                            return false;
                        }
                    });

                    // Load data from local source
                    var source = '/ausgov_search/autocomplete/data.json';
                    jQuery.getCachedJSON(source, loadSuggest, config.localStorage);
                },

                open: function () {
                    jQuery(this).autocomplete('widget').css('z-index', config.zindex);
                    jQuery(this).autocomplete('widget').css('top', config.top);
                    jQuery(this).autocomplete('widget').addClass('search-ac');
                    return false;
                },

                delay: config.delay,

                minLength: config.length,

                // focus: function(evt, ui) {}

                select: function (evt, ui) {
                    if (ui.item.extra) {
                        switch (ui.item.extra.t) {
                            case 'U':
                                document.location = ui.item.extra.a;
                                break;
                            default:
                                //jQuery(this).attr('value', ui.item.extra.action);
                                if (ui.item.extra.a == '') {
                                    jQuery(this).val(ui.item.value);
                                } else {
                                    jQuery(this).val(ui.item.extra.a);
                                }
                                jQuery(this).context.form.submit();
                        }
                    } else {
                        // Submit the form on select
                        jQuery(this).attr('value', ui.item.value);
                        jQuery(this).context.form.submit();
                    }
                    return false;
                }
            }).data("autocomplete")._renderItem = function (ul, item) {
                var label;

                if (item.category) {
                    // Category header
                    return jQuery('<li><h2>' + item.label + '</h2></li>').appendTo(ul);
                } else {
                    // Single string suggestion
                    label = item.label.replace(new RegExp('(' + item.matchOn + ')', 'i'), '<strong>$1</strong>');
                }

                if (item.extra && item.extra.a == "") {
                    return jQuery('<li></li>')
                        .data('item.autocomplete', item)
                        .append('<a class="internal">' + label + '</a>')
                        .appendTo(ul);
                } else {
                    return jQuery('<li></li>')
                        .data('item.autocomplete', item)
                        .append('<a>' + label + '</a>')
                        .appendTo(ul);
                }
            };
        });
        return this;
    };
})(jQuery, Drupal, this, this.document);
