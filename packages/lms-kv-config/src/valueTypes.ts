import {
  llmContextOverflowPolicySchema,
  llmLlamaAccelerationSettingSchema,
  llmLlamaLogitBiasConfigSchema,
  llmLlamaMirostatSamplingConfigSchema,
  llmPromptTemplateSchema,
  llmStructuredPredictionSettingSchema,
} from "@lmstudio/lms-shared-types";
import { z } from "zod";
import { KVFieldValueTypesLibraryBuilder, type InferKVValueTypeDef } from "./KVConfig";

export const kvValueTypesLibrary = new KVFieldValueTypesLibraryBuilder()
  .valueType("numeric", {
    paramType: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      int: z.boolean().optional(),
      slider: z
        .object({
          min: z.number(),
          max: z.number(),
          step: z.number(),
        })
        .optional(),
      hidden: z.boolean().optional(),
      shortHand: z.string().optional(),
    }),
    schemaMaker: ({ min, max, int }) => {
      let schema = z.number();
      if (min !== undefined) {
        schema = schema.min(min);
      }
      if (max !== undefined) {
        schema = schema.max(max);
      }
      if (int) {
        schema = schema.int();
      }
      return schema;
    },
  })
  .valueType("checkboxNumeric", {
    paramType: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      int: z.boolean().optional(),
      slider: z
        .object({
          min: z.number(),
          max: z.number(),
          step: z.number(),
        })
        .optional(),
      hidden: z.boolean().optional(),
    }),
    schemaMaker: ({ min, max, int }) => {
      let numberSchema = z.number();
      if (min !== undefined) {
        numberSchema = numberSchema.min(min);
      }
      if (max !== undefined) {
        numberSchema = numberSchema.max(max);
      }
      if (int) {
        numberSchema = numberSchema.int();
      }
      return z.object({
        checked: z.boolean(),
        value: numberSchema,
      });
    },
  })
  .valueType("string", {
    paramType: z.object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      hidden: z.boolean().optional(),
    }),
    schemaMaker: ({ minLength, maxLength }) => {
      let schema = z.string();
      if (minLength !== undefined) {
        schema = schema.min(minLength);
      }
      if (maxLength !== undefined) {
        schema = schema.max(maxLength);
      }
      return schema;
    },
  })
  .valueType("boolean", {
    paramType: z.void(),
    schemaMaker: () => {
      return z.boolean();
    },
  })
  .valueType("stringArray", {
    paramType: z.object({
      maxNumItems: z.number().optional(),
      /**
       * Whether to allow empty strings in the array. Default is false.
       */
      allowEmptyStrings: z.boolean().optional(),
      hidden: z.boolean().optional(),
    }),
    schemaMaker: ({ maxNumItems, allowEmptyStrings }) => {
      let stringSchema = z.string();
      if (!allowEmptyStrings) {
        stringSchema = stringSchema.min(1);
      }
      let schema = z.array(stringSchema);
      if (maxNumItems !== undefined) {
        schema = schema.max(maxNumItems);
      }
      return schema;
    },
  })
  .valueType("contextOverflowPolicy", {
    paramType: z.void(),
    schemaMaker: () => {
      return llmContextOverflowPolicySchema;
    },
  })
  .valueType("llmPromptTemplate", {
    paramType: z.void(),
    schemaMaker: () => {
      return llmPromptTemplateSchema;
    },
  })
  .valueType("llamaStructuredOutput", {
    paramType: z.void(),
    schemaMaker: () => {
      return llmStructuredPredictionSettingSchema;
    },
  })
  .valueType("llamaGpuOffload", {
    paramType: z.object({
      numLayers: z.number().optional(),
      hidden: z.boolean().optional(),
    }),
    schemaMaker: () => {
      return llmLlamaAccelerationSettingSchema;
    },
  })
  .valueType("llamaMirostatSampling", {
    paramType: z.void(),
    schemaMaker: () => {
      return llmLlamaMirostatSamplingConfigSchema;
    },
  })
  .valueType("llamaLogitBias", {
    paramType: z.void(),
    schemaMaker: () => {
      return llmLlamaLogitBiasConfigSchema;
    },
  })
  .build();

export type KVValueTypeDef = InferKVValueTypeDef<typeof kvValueTypesLibrary>;
