import { nanoid } from 'nanoid';
import { QuestionType } from '../constants/question';

export function genListenSelect() {
  return {
    id: `tobeadded-${nanoid()}`,
    type: QuestionType.LISTEN_SELECT,
    name: '',
    content: {
      content: '',
      audioSrc: '',
      fields: [
        {
          id: 0,
          answer: '',
        },
      ],
      answer: '',
    },
  };
}

export function genListenDetermine() {
  return {
    id: `tobeadded-${nanoid()}`,
    type: QuestionType.LISTEN_DETERMINE,
    name: '',
    content: {
      content: '',
      audioSrc: '',
      fields: [
        {
          id: 0,
          answer: '正确',
        },
        {
          id: 1,
          answer: '错误',
        },
      ],
      answer: '',
    },
  };
}

export function genOralWithText() {
  return {
    id: `tobeadded-${nanoid()}`,
    type: QuestionType.ORAL_WITH_TEXT,
    name: '',
    content: {
      audioSrc: '',
    },
  };
}

export function genOralWithAudio() {
  return {
    id: `tobeadded-${nanoid()}`,
    type: QuestionType.ORAL_WITH_AUDIO,
    name: '',
    content: {
      content: '',
      audioSrc: '',
    },
  };
}

export function questionParser(inputSchema) {
  return { ...inputSchema, content: JSON.parse(inputSchema.content) };
}
