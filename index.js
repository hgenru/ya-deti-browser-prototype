var SUGGESTIONS = [
    {
        title: 'Фиксики',
        type: 'video',
        picture: 'http://www.youmult.net/_sf/1/153.jpg',
        source: 'https://www.youtube.com/watch?v=gtm1Ks1AFAw'
    },
    {
        title: 'Гравипадово',
        type: 'video',
        source: 'https://www.youtube.com/watch?v=QieiWpGLeRQ',
        picture: 'http://datakogda.ru/wp-content/uploads/2015/07/Kogda-vyydet-Graviti-Folz-3-sezon-data-vykhoda.jpg'
    },
    {
        title: 'Про китов',
        type: 'video',
        picture: 'http://kinodom.org/uploads/posts/2014-09/1409594151_sinij-kit.jpg',
        source: 'https://www.youtube.com/watch?v=vlEUCUqHCJs'
    },
    {
        title: 'Про кiтов',
        type: 'video',
        picture: 'http://dooced.ru/wp-content/uploads/2015/05/koty_prikolnye_s_kotami_1600x1200.jpg',
        source: 'https://www.youtube.com/watch?v=HIiFLJT3aoA'
    }
];

function initRecognizer(ctx) {
    var SpeechRecognition = window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        var recognizer = new SpeechRecognition();
        recognizer.lang = 'ru-RU';
        recognizer.continuous = true;
        recognizer.interimResults = true;
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

    if (localStorage.getItem('user')) {
        this.currentScreen = ko.observable('home');
    } else {
        this.currentScreen = ko.observable('acquaintance');
    }

    this.menuIsOpen = ko.observable(true);
    this.themePicture = ko.observable(null);
    this.themeColor = ko.observable();

    this.acquaintanceStep = ko.observable(0);
    this.speech = "";

    self.recognizer = ko.observable({
        recognizer: null,
        isListen: false,
        enable: false
    });

    self.result = ko.observable('');

    initRecognizer(self);

    this.recognizerStartHandler = function() {
        this.result('');
        if (this.recognizer().enable && !this.recognizer().isListen) {
            self.recognizer(
                Object.assign({}, self.recognizer(), {isListen: true})
            );
            var recognizer = this.recognizer().recognizer;
            recognizer.onresult = function(e) {
                var interim_transcript = '';
                var final_transcript;
                // var final_transcript = this.result();
                for (var i = e.resultIndex; i < e.results.length; ++i) {
                    if (e.results[i].isFinal) {
                        final_transcript = final_transcript + e.results[i][0].transcript;
                    } else {
                        interim_transcript = interim_transcript + e.results[i][0].transcript;
                    }
                }
                final_transcript = final_transcript;
                // console.group('recognizer result');
                // var index = e.resultIndex;
                //
                // console.group('варианты');
                // for (let res of e.results[index]) {
                //     console.log(res.transcript);
                // }
                // console.groupEnd();
                //
                // var result = e.results[index][0].transcript.trim();
                // console.log('выбрал:', result);
                // console.groupEnd();

                self.result(final_transcript);
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
