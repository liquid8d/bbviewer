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
        padding: 0.25em;
    }
    .bar > .col {
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        display: flex;
    }
    .bar > .col.left {
        justify-content: flex-start;
        max-width: 20%;
    }
    .bar > .col.right {
        justify-content: flex-end;
        max-width: 20%;
    }
</style>