<template>
    <div class="page overlay">
        <div class="container stretch">
            <h1>{{ $t('settings') }}</h1>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
        </div>
    </div>
</template>

<script>
    import Utils from '@/mixins/Utils'
    export default {
        name: 'settings',
        mixins: [ Utils ],
        mounted () {
            this.preventDraggables()
        }
    }
</script>

<style>
    a {
        margin-right: 1em;
    }
</style>