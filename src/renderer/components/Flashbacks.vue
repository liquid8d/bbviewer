<template>
    <div class="page overlay">
        <div class="container stretch">
            <h1>{{$t('flashbacks')}}</h1>
            <h2>{{$t('date')}}</h2>
            <span>{{$t('month')}} {{$t('day')}} {{$t('year')}}</span>
            <h2>{{$t('time')}}</h2>
            <span>{{$t('hour')}} {{$t('minute')}} {{$t('second')}}</span>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "date": "Date",
        "flashbacks": "Flashbacks",
        "month": "Month",
        "time": "Time",
        "day": "Day",
        "year": "Year",
        "hour": "Hour",
        "minute": "Minute",
        "second": "Second"
    }
}
</i18n>

<script>
    export default {
        name: 'flashbacks',
        mounted () {

        }
    }
</script>