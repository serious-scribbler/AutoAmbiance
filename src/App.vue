<script setup lang="ts">
import { ref, useTemplateRef, watchEffect } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import { useDisplayMedia } from '@vueuse/core';
import { usePipeline } from './composables/ai/usePipeline';
const { stream, start, stop } = useDisplayMedia();

const output = ref("");

const error = ref<string|undefined>();
const interpreter = usePipeline("image-to-text");
const videoElem = useTemplateRef("video");

watchEffect(() => {
  if(!videoElem.value) return;
    if (!stream.value) return;
    videoElem.value.srcObject = stream.value;
});




async function interpretNow() {
  if(!interpreter.value) {
    error.value = "Image2Text not ready";
    return;
  };
  if(!videoElem.value) {
    error.value = "Video element not ready!";
  }
  if(videoElem.value === null) return;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = videoElem.value.width;
  canvas.height = videoElem.value.height;
  if(context === null) {
    error.value = "Context is null";
    return;
  }
  context.drawImage(videoElem.value, 0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL("image/png");
  const generated = await interpreter.value(url);
  console.log(generated);
  output.value = JSON.stringify(generated);
}
</script>

<template>
  <header>
    <h1 class="text-4xl font-bold py-4 w-full text-center">AutoAmbiance</h1>
  </header>

  <main>
    <button @click="start">Start capture</button>
    <video ref="video" muted autplay controls class="hidden" />
    <button @click="interpretNow">Interpret Screen</button>
    <h3 class="text-red py-2" v-if="error">{{ error }}</h3>
    <h4>Output:</h4>
    <textarea class="w-[400px] h-[400px] border border-solid border-white">
      {{ output }}
    </textarea>
  </main>
</template>

<style scoped>

</style>
