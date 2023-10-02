<template>
    <div class="quizz">
        <p class="quizz--question">{{title}}</p>
        <div class="quizz--answers">
            <div class="quizz--choice" 
            v-for="answer in answers"
            :key="answer.id"
            @click="() => props.onAnswerClick(props.id, answer.id)"
            :style="getBackColor(answer)"
        >
            {{answer.questionTitle}}
        </div>
        </div>
        <div class="quizz--separator"></div>
    </div>
</template>
<script setup>
const props = defineProps({
    id: [String, Number],
    title: String,
    answers: Array,
    onAnswerClick: Function,
    isFinished: Boolean
})

function getBackColor(answer){
    let styles
    if(props.isFinished){
        if(answer.isCorrect)
            styles = {
                backgroundColor: '#94D7A2'
            }
        else if(answer.isHeld && !answer.isCorrect){
            styles = {
                backgroundColor: '#F8BCBC',
                color: 'grey',
                borderColor: 'grey'
            }
        }
        else {
            styles = {
                color: 'grey',
                borderColor: 'grey'
            }
        }
    }
    else {
        if(answer.isHeld){
            styles = {
                backgroundColor: '#D6DBF5',
                border: 'none'
            }
        } else {
            styles = {
                backgroundColor: 'white'
            }
        }
    }
    return styles
}
</script>
<style>
</style>