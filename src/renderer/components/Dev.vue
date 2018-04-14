<template>
    <div class="page">
        <div class="container stretch">
            <h1>DEV</h1>
            <ul>
                <li>One</li>
                <li>Two</li>
                <li>Three</li>
                <li>Four</li>
                <li>Five</li>
                <li>Six</li>
                <li>Seven</li>
                <li>Eight</li>
            </ul>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('-1')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "back": "Back"
    }
}
</i18n>

<script>
export default {
    name: 'dev',
    mounted () {
        console.log('dev mounted')
    }
}
</script>

<style scoped>
    ul {
        background-color: #eee;
        padding: 2em;
        list-style-type: none;
        max-height: 16em;
        overflow: auto;
    }
    
    ul li {
        background-color: #999;
        padding: 1em;
        margin: 1em;
    }
</style>