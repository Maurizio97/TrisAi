var app = new Vue(
    {
        el: "#container",
        data: {
            // dati sulla partita
            storeClick: [],
            dbData: {},

            // gestione click
            click: false,

            // dati url
            player:'',
            stanza:'',

            // gestione input
            playerInput:'',
            stanzaInput:'',
            nomeInput: '',
            join: false,
            // gestisce il vincitore
            winner: false,

            // array dati sul vincitore
            winnerCombination: [],
        },

        async mounted(){

            // const rawResponse = await fetch('http://localhost:6969/game', {
            //     method: 'get',
            //     mode: 'cors',
            //     headers: {
            //     'Accept': 'application/json',
            //     'Content-Type': 'application/json',
            //     'Access-Control-Allow-Origin':'*'
            //     },
            // });
            // spese = await rawResponse.json();
            // console.log(spese);
            // this.toEmptyInput();
            // valore url
            // const queryString = window.location.search;
            // salvo l'url
            // const urlParams = new URLSearchParams(queryString);
            // valore stanza
            // this.stanza = urlParams.get('stanza');
            // this.join = urlParams.get('join') ? true : false;

            // // valore player
            // this.player = urlParams.get('player');
            // setInterval(this.getData, 1000);
        },

        methods: {
            // funzione che gestisce il click (asincrona)
            async clicked(position) {
                // controllo primo click
                // if (this.dbData.lastUser != this.player) {
                //     this.click = false
                // }

                // controllo generico click
                // se storeClick contiene la cella cliccata && click e' falso && winner e' falso
                if (!this.storeClick.includes(position)
                    && !this.dbData[position]
                    // && this.click === false
                    && this.winner == false) {

                        // pusho la position nello storeClick
                        this.storeClick.push(position)
                        console.log(this.storeClick);
                        // se la lunghezza di storeclick <= 1
                        let bool = this.storeClick.length > 1? false : true;
                        json = {
                            'position': position,
                            'firstMove': bool
                        }

                        data = JSON.stringify(json)
                        console.log(position);
                        const response = await fetch('http://localhost:6969/game', {
                            method: 'post',
                            headers: {
                                "Content-Type": "application/json;charset=UTF-8"
                            },
                            body: data
                        })
                        spese = await response.json();
                        console.log(spese);
                        // const rawResponse = await fetch('http://localhost:6969/game', {
                        //     method: 'get',
                        //     mode: 'cors',
                        //     headers: {
                        //     'Accept': 'application/json',
                        //     'Content-Type': 'application/json',
                        //     'Access-Control-Allow-Origin':'*'
                        //     },
                        // });
                        // spese = await rawResponse.json();
                        // console.log(spese);
                        // salvo il risultato in dbData
                        // this.dbData = res.data;
                        // valorizzo click con true (non posso cliccare)
                        this.click = true;

                        // controllo win
                        // se winner data esiste
                    // if (res.data.winnerData) {
                    //     // creo un allert
                    //     alert('partita finita ' + res.data.lastUser);
                    //     // click e winner diventano'true'
                    //     this.click = true;
                    //     this.winner = true;
                    //     // valorizzo winnerCombination con l'array contente le posizioni delle celle vincenti
                    //     this.winnerCombination = res.data.winnerData.ceilWin;

                    // }

                    // controllo pareggio
                    // se nClick(count dei click) = 9 e winner e' falso
                    if (this.dbData.nclick == 9 && !this.winner) {
                        alert('Pareggio');
                        this.reset();
                    }
                }
            },

            // call axios che torna i dati dal db(coordinate, winner, last user)
            getData(){
                axios.get(`server.php?stanza=${this.stanza}&player=${this.player}&join=${this.join}`)
                    .then(r => {
                        // salvo i dati
                        this.dbData = r.data;
                        // valorizzo click con false nel momento che lastuser non e' l'utente della pagina
                        this.click = this.dbData.lastUser == this.player;

                        // controllo reset
                        if (this.dbData.reset) {
                            // svuoto i dati della partita
                            this.dbData = {};
                            this.storeClick = [];

                            // valorizzo winner per reset classi
                            this.winner = false;
                        }

                        if (r.data.player) {
                            this.player = r.data.player;
                        }
                        // controllo win
                        if (r.data.winnerData.ceilWin !== undefined) {
                            this.winner = true;
                            // valorizzo winnerCombination con l'array contente le posizioni delle celle vincenti
                            this.winnerCombination = r.data.winnerData.ceilWin;
                        }

                    })
                    .catch(e => console.error(e));
            },

            // reset game
            reset() {
                // svuoto i dati della partita
                this.dbData = {};
                this.storeClick = [];

                // valorizzo winner per reset classi
                this.winner = false;
                // avviso il back-end che la partita e' finita
                axios.get(`server.php?stanza=${this.stanza}&reset`)
                    .then(r => {})
                    .catch(e => console.error(e));
            }
        },
    }
)