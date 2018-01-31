<template>
    <div class="bar">
        <div class="col left">
            <slot name="left"></slot>
        </div>
        <div class="col">
            <slot name="center"></slot>
        </div>
        <div class="col right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<style scoped>
    .bar {
        flex-shrink: 0;
        display: flex;
        width: 100%;
        padding-left: 0.25em;
        padding-right: 0.25em;
    }
    .bar > .col {
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        display: flex;
    }
    .bar > .col.left {
        justify-content: flex-start;
    }
    .bar > .col.right {
        justify-content: flex-end;
    }
</style>