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

function initRecognizer(ctx) {
    var SpeechRecognition = window.SpeechRecognition ||
                            window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        var recognizer = new SpeechRecognition();
        recognizer.lang = 'ru-RU';
        recognizer.continuous = false;
        recognizer.interimResults = false;
        recognizer.maxAlternatives = 5;

        recognizer.onerror = function(e) {
            if (e.error === 'not-allowed') {
                Object.assign({}, ctx.recognizer(), {
                    enable: false,
                    recognizer: recognizer
                });
            }
        };

        ctx.recognizer(
            Object.assign({}, ctx.recognizer(), {
                enable: true,
                recognizer: recognizer
            })
        );
    }
}

function AppViewModel() {
    var self = this;

    this.currentScreen = ko.observable('acquaintance');
    this.acquaintanceStep = ko.observable(0);

    self.recognizer = ko.observable({
        recognizer: null,
        isListen: false,
        enable: false
    });

    self.result = ko.observable("");

    initRecognizer(self);

    this.recognizerStartHandler = function() {
        this.result('');
        if (this.recognizer().enable && !this.recognizer().isListen) {
            self.recognizer(
                Object.assign({}, self.recognizer(), {isListen: true})
            );
            var recognizer = this.recognizer().recognizer;
            recognizer.onresult = function(e) {
                console.group('recognizer result');
                var index = e.resultIndex;

                console.group('варианты');
                for (let res of e.results[index]) {
                    console.log(res.transcript);
                }
                console.groupEnd();

                var result = e.results[index][0].transcript.trim();
                console.log('выбрал:', result);
                console.groupEnd();

                self.result(result);
                recognizer.stop();
                self.recognizer(
                    Object.assign({}, self.recognizer(), {isListen: false})
                );
            };
            console.log('я слушаю');
            recognizer.start();
        } else {
            if (self.recognizer().isListen) {
                self.recognizer(
                    Object.assign({}, self.recognizer(), {isListen: false})
                );
                self.recognizer().recognizer.abort();
                // self.recognizer().recognizer.stop();
            }
            console.log();
        }
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
