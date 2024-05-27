import { makeAutoObservable, runInAction } from "mobx";
const url = 'https://6396034b90ac47c6807aa35e.mockapi.io';

export default class WordStore {

    words = [];
    isLoaded = false;
    error = '';

    constructor() {
        makeAutoObservable(this);
    }

    translateToEstonian = (russianText) => {
        const translationMap = {
            "кошка": "kass",
            "кукуруза": "mais",
            "бабочка": "liblikas",
            "ежик": "siil",
            "ребенок": "laps",
            "мать": "ema",
            "отец": "isa",
            "тормоз": "pidur",
            "тормозная жидкость": "pidurivedelik",
            "лампы": "lambid",
            "собака": "koer",
            "животные": "animals",
            "растения": "plants",
            "насекомое": "insect",
            "семья": "family",
            "автомобиль": "car"
        };
        return translationMap[russianText] || russianText;
    }

    loadData = () => {
        fetch(url + '/words')
            .then((result) => {
                if (result.ok) {
                    return result.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then((words) => {
                runInAction(() => {
                    const updatedWords = words.map(word => ({
                        ...word,
                        russian: this.translateToEstonian(word.russian),
                        tags: this.translateToEstonian(word.tags)
                    }));
                    this.words = updatedWords;
                    this.isLoaded = true;
                });
            }).catch(error => {
                runInAction(() => {
                    this.isLoaded = true;
                    this.error = error.message;
                });
            });
    }

    add = (newWord) => {
        fetch(url + '/words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newWord)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(() => this.loadData())
            .catch(error => {
                runInAction(() => {
                    this.error = error.message;
                });
            });
    }

    remove = (id) => {
        fetch(url + `/words/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(() => this.loadData())
            .catch(error => {
                runInAction(() => {
                    this.isLoaded = true;
                    this.error = error.message;
                });
            });
    }

    update = (id, data) => {
        fetch(url + `/words/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(() => this.loadData())
            .catch(error => {
                runInAction(() => {
                    this.error = error.message;
                });
            });
    }

    saerchTearm = '';

    search = (value) => {
        this.saerchTearm = value;
    }
    
    isValid = (element) => (element.length > 0) ? true : false;

    count = 0;
    learnedWords = 0;

    increment = () => {
        this.count = this.count < this.words.length - 1 ? this.count + 1 : 0;
        this.learnedWords = this.learnedWords < this.words.length  ? this.learnedWords + 1 : this.words.length;
    }

    decrement = () => {
        this.count = this.count > 0 ? this.count - 1 : this.words.length - 1;
    }
}
