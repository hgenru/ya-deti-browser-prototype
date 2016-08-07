var SUGGESTIONS = [
    {
        title: 'Фиксики',
        type: 'video',
        picture: 'http://www.youmult.net/_sf/1/153.jpg',
        source: 'https://www.youtube.com/watch?v=gtm1Ks1AFAw'
    },
    {
        title: 'Маша и Медведь',
        type: 'video',
        source: 'https://www.youtube.com/watch?v=uriXIjs5U18',
        picture: 'http://smiimg.dt00.net/smi/2012/06/201206081338533783980.jpg'
    },
    {
        title: 'Про китов',
        type: 'video',
        picture: 'http://kinodom.org/uploads/posts/2014-09/1409594151_sinij-kit.jpg',
        source: 'https://www.youtube.com/watch?v=vlEUCUqHCJs'
    },
    {
        title: 'Про китов',
        type: 'video',
        picture: 'http://kinodom.org/uploads/posts/2014-09/1409594151_sinij-kit.jpg',
        source: 'https://www.youtube.com/watch?v=vlEUCUqHCJs'
    }
];

function AppViewModel() {
    var self = this;
    var SpeechRecognition = window.SpeechRecognition ||
                            window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        var recognizer = new SpeechRecognition();
        recognizer.lang = 'ru-RU';
        recognizer.continuous = false;
        recognizer.interimResults = false;
        recognizer.onresult = function(e) {
            var index = e.resultIndex;
            var result = e.results[index][0].transcript.trim();
            console.log(result);
            self.recognizer.stop();
        };
        recognizer.onerror = function(e) {
            if (e.error === 'not-allowed') {
                console.log('мне запретили доступ');
                self.isRecognizerEnabled = false;
            }
        };
        this.isRecognizerEnabled = true;
        this.recognizer = recognizer;
        //
    } else {
        console.log('fail');
        this.isRecognizerEnabled = false;
    }

    this.recognizerStartHandler = function() {
        console.log('я слушаю');
        this.recognizer.start();
    };

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
