<template>
    <div class="page">
        <div class="container">
            <h2>Browse</h2>
        </div>
        <div class="container" style="flex-grow:1; overflow:auto;">
            <div v-if="items" class="card" v-bind:key="item.title" v-for="item in items">
                <img v-bind:src="item.poster" />
                <div class="content">
                    <h1>{{item.title}}</h1>
                    <p>{{item.desc}}</p>
                    <button @click.prevent="play(item.src)">Play</button>
                </div>
            </div>
        </div>
        <div class="container">
            <router-link to="/" tag="button">Back</router-link>
            <!-- <button @click.prevent="fetch('https://goodiesfor.me/bbviewer/content')">Fetch</button> -->
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    const { PlayerEvents } = require('./Player/PlayerEvents')
    
    export default {
        name: 'browse',
        components: { PlayerEvents },
        data () {
            return {
                lastFetch: 0,
                updateFreq: 300,
                items: []
            }
        },
        mounted () {
            // do fetch
            if (this.items.length === 0 || Date.now() > this.lastFetch + this.updateFreq) {
                this.updateFreq = Date.now()
                this.fetch('http://goodiesfor.me/bbviewer/content')
            }
            this.$extendedInput.selectEl()
        },
        methods: {
            fetch (src) {
                axios.get(src)
                    .then((response) => {
                        if (response.data && response.data.items) this.items = response.data.items
                    })
                    .catch((err) => {
                        console.log('error getting content: ' + err)
                    })
            },
            play (src) {
                this.playerRedirect('play', src)
                this.$router.push('/')
            },
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        }
    }
</script>

<style>
    .card {
        position: relative;
        display: inline-flex;
        background-color: #111;
        border: 2px solid #222;
        margin: 1em;
        padding: 0.5em;
        width: 10em;
        height: 12em;
    }

    .card > img {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .card > .content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4em;
        padding: 0.5em;
        background-color: rgba(10, 10, 10, 0.9);
    }

    .card > .content > h1 {
        color: #efefef;
        font-size: 0.75em;
    }

    .card > .content > p {
        color: #888;
        font-size: 0.6em;
    }

    .card button {
        position: absolute;
        bottom: 2.5em;
        right: 0;
    }

    .spinner {
    margin: 100px auto 0;
    width: 70px;
    text-align: center;
    }

    .spinner > div {
    width: 18px;
    height: 18px;
    background-color: #333;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    }

    .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
    }

    .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
    }

    @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% { -webkit-transform: scale(0) }
    40% { -webkit-transform: scale(1.0) }
    }

    @keyframes sk-bouncedelay {
    0%, 80%, 100% { 
        -webkit-transform: scale(0);
        transform: scale(0);
    } 40% { 
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
    }
    }
</style>