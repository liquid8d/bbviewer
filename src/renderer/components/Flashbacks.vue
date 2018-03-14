<template>
    <div class="page overlay">
        <div class="container stretch">
            <div v-if="type === 'date'" class="dateselect">
                <h1>{{$t('flashbacks')}}</h1>
                <h2>{{$t('date')}}</h2>
                <span>{{$t('month')}} {{$t('day')}} {{$t('year')}}</span>
                <h2>{{$t('time')}}</h2>
                <span>{{$t('hour')}} {{$t('minute')}} {{$t('second')}}</span>
                <h2>{{$t('angle')}}</h2>
            </div>
            <div v-else class="listselect">
                <ul v-for="item in listItems" v-bind:key="item.id">
                    <li>{{item.label}}</li>
                </ul>
            </div>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "angle": "Angle",
        "back": "Back",
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
        data () {
            return {
                type: 'date',
                currentDate: {
                    month: 6,
                    day: 29,
                    year: 2018
                },
                listItems: [],
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                years: [2018]
            }
        },
        mounted () {

        }
    }
</script>