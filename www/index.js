var SUGGESTIONS = [
    {
        'title': 'Маша и Медведь',
        type: 'video',
        source: 'https://www.youtube.com/watch?v=uriXIjs5U18',
        picture: 'http://smiimg.dt00.net/smi/2012/06/201206081338533783980.jpg'
    },
    {
        'title': 'Про китов',
        type: 'video',
        picture: 'http://kinodom.org/uploads/posts/2014-09/1409594151_sinij-kit.jpg',
        source: 'https://www.youtube.com/watch?v=vlEUCUqHCJs'
    }
]

function AppViewModel() {
    var self = this;

    this.suggestions = SUGGESTIONS;
    this.currentSuggestIndex = ko.observable(0);
    this.currentSuggest = ko.pureComputed(function() {
        return self.suggestions[self.currentSuggestIndex()];
    }, this);

    this.clickYesHandler = function() {
        window.location.href = self.currentSuggest().source;
    };
    this.clickNoHandler = function() {
        self.currentSuggestIndex(self.currentSuggestIndex() + 1);
    };
}

window.m_site = new AppViewModel();
ko.applyBindings(window.m_site);
