<template>
    <div class="page overlay">
        <div class="container">
            <h1>{{ $t('title') }}</h1>
        </div>
        <div class="backdrop" style="flex-grow:1">
            <webview v-if="$store.state.isElectron" ref="browser" :src="url"></webview>
            <div v-else class="container">
                <h1>{{ $t('label') }}</h1>
                <p>{{ $t('desc') }}</p>
                <a :href="url" target="_blank">{{ $t('link') }}</a>
            </div>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="/static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "title": "Donate",
        "label": "Thank you for your support!",
        "desc": "You can donate to help support the development of BBViewer via PayPal by clicking the link below.",
        "link": "Click here to donate!"
    }
}
</i18n>

<style scoped>
    .backdrop {
        background-color: #222;
        position: relative;
        margin: 0.5em;
        padding: 0;
    }
    webview {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>

<script>
    export default {
        data () {
            return {
                url: 'https://www.paypal.me/liquid8d'
            }
        },
        methods: {
            close () {
                this.$router.replace('/')
            }
        }
    }
</script>