<template>
    <div class="page">
        <div class="container">
            <h1>{{ $t('title') }}</h1>
        </div>
        <div class="container">
            <webview ref="browser" v-if="$store.state.isElectron" :src="url"></webview>
            <div v-else class="browser-donate">
                <h1>{{ $t('label') }}</h1>
                <p>{{ $t('desc') }}</p>
                <a :href="url" target="_blank">{{ $t('link') }}</a>
            </div>
        </div>
        <div class="container">
            <router-link to="/" tag="button">{{ $t('back') }}</router-link>
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
    webview {
        width: 100%;
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