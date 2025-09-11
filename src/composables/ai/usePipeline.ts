import { ref } from 'vue';
import { pipeline, Pipeline, type PipelineType, type PretrainedModelOptions, type AllTasks, env } from '@huggingface/transformers';

env.localModelPath = "/models/";
env.allowLocalModels = true;
env.allowRemoteModels = false;


export function usePipeline<T extends PipelineType>(pipelineType: T, model: string | undefined = undefined, options: PretrainedModelOptions = {}) {
    const result = ref<AllTasks[T] | undefined>(undefined);
    pipeline(pipelineType, model, options).then(elem => result.value = elem);
    return result;
}