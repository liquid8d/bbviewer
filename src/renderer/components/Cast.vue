<template>
    <div class="page overlay">
        <div class="container stretch">
            <h1>{{$t('cast')}}</h1>
            <p>Reserved for ChromeCast</p>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "cast": "Cast"
    }
}
</i18n>

<script>
    export default {
        name: 'cast',
        mounted () {

        }
    }
</script>