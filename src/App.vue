<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import axios from 'axios'
import {decode} from 'html-entities';
import { nanoid } from 'nanoid'
import Question from './components/Question.vue';


const quizzQuestions= ref([]);
const isFinished = ref(false)
const isStarted = ref(false)
const correctAnswers = ref(0)
  
const notify = () => toast("not so fast cowboy. answer ALL the questions", {
  position: 'bottom-left',
  autoClose: 1000
});

async function startGame(){
  const { data } = await axios.get('https://opentdb.com/api.php?amount=5')
  quizzQuestions.value = (data.results.map(question => {
    question.correct_answer = {questionTitle: decode(question.correct_answer), isHeld: false, id: nanoid(), isCorrect: true }
    question.incorrect_answers= question.incorrect_answers.map(
      answer => ({
        questionTitle: decode(answer),
        isHeld: false,
        id: nanoid(),
        isCorrect: false
      })
    )
    return {
          ...question,
          question: decode(question.question),
          answers: shuffleAnswers([question.correct_answer, ...question.incorrect_answers]),
          id: nanoid()
        }
      }
      ))
  isStarted.value = true
}

function shuffleAnswers(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array
}

function toggleAnswer(questId, answerId){ 
  if(!isFinished.value){
    quizzQuestions.value = quizzQuestions.value.map(question => {
      return question.id === questId ? 
      {
        ...question, 
        answers: question.answers.map(answer => answer.id === answerId ? {...answer, isHeld: !answer.isHeld} : {...answer, isHeld: false} )
      } : 
      question
    })
  }
} 

function checkAnswers(){
  console.log("CHECKING")
  if(quizzQuestions.value.every(question => question.answers.some(answer => answer.isHeld))){
    let correctAnswersCount = 0
    quizzQuestions.value.forEach(quesiton => quesiton.answers.forEach(answer =>{ if(answer.isCorrect && answer.isHeld) correctAnswersCount++}))
    correctAnswers.value = correctAnswersCount
    isFinished.value = true
  } else notify()
}

  function startAgain(){
    isFinished.value = false
    startGame()
  }

</script>

<template>
    <main v-if="isStarted">
      <Question 
          v-for="question in quizzQuestions"
          :key="question.id" 
          :id="question.id"
          :title="question.question"
          :answers="question.answers"
          :onAnswerClick="toggleAnswer"
          :isFinished="isFinished"
      />
    
    <div class='footer'>
      <p  v-if="isFinished" class='finalscore'>You scored {{correctAnswers}}/{{quizzQuestions.length}} correct answers</p>
      <button v-on="{click: isFinished ? startAgain : checkAnswers}">{{isFinished ? "Play again" : "Check answers"}}</button>
    </div>
    </main>
    <main class='welcome-screen' v-else>
      <h1 class='game-title'>Quizzical</h1>
       <p class='game-description'>Conquer your cluelessness with the ingeneous quiz that helps you learn about the things.</p>
       <button @click="startGame">Play</button>
    </main>
    <img src='@/assets/blobs_blue.svg' class='blob-blue'/>
    <img src='@/assets/blobs_yellow.svg' class='blob-yellow'/>
</template>

<style>
* {
  font-family: 'Karla', sans-serif;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.875rem;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.quizz {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.quizz--question {
  max-width: 31.25rem;
  font-weight: 700;
  font-size: 1rem;
  color: #293264;
  text-align: center;
}

.quizz--answers {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.9375rem;
}

.quizz--choice {
  border: 0.0496rem solid #4D5B9E;
  border-radius: 0.5rem;
  max-width: 6.25rem;
  padding: 0.3125rem;
  height: fit-content;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  font-size: 0.625rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  
}

.quizz--separator {
  width: 24.9375rem;
  height: 0rem;  
  border: 0.0496rem solid #DBDEF0;
}

button {
  min-width: 7.5rem;
  width: fit-content;
  height: 2.1875rem;
  background: #4D5B9E;
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 0.8rem;
  color: #F5F7FB;
  border: none;
}

button:active {
  box-shadow: inset 0.3125rem 0.3125rem 0.125rem #293264;
}

.footer {
  margin-top: 1.875rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.5rem
}
.welcome-screen{
  margin-top: 20%;
}

.game-title {
  font-weight: 700;
  font-size: 2rem;
  line-height: 2.3125rem;
  text-align: center;
  color: #293264;
}

.game-description {
  width: 28.125rem;
  font-family: 'Inter';
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.1875rem;
  text-align: center;
  color: #293264;
  margin-bottom: 1.875rem;
}

.blob-blue {
  position: fixed;
  left: 0rem;
  bottom: 0rem;
  z-index: -1;
}

.blob-yellow {
  position: fixed;
  right: 0rem;
  top: 0rem;
  z-index: -1;
}

button {
  cursor: pointer;
}

@media screen and (max-width: 31.25rem) {
  main, .game-description, .quizz, .quizz--separator {
    width: 100%;
  }

  .quizz--answers {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem
  }
}
</style>
