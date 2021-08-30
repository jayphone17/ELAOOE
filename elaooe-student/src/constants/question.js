import {
  genListenDetermine,
  genListenSelect,
  genOralWithAudio,
  genOralWithText,
} from '../utils/question';

export const QuestionType = {
  LISTEN_SELECT: 'LISTEN_SELECT',
  LISTEN_DETERMINE: 'LISTEN_DETERMINE',
  ORAL_WITH_TEXT: 'ORAL_WITH_TEXT',
  ORAL_WITH_AUDIO: 'ORAL_WITH_AUDIO',
};

export const QuestionComponentType = {
  LISTEN_SELECT: 'listen-select',
  LISTEN_DETERMINE: 'listen-determine',
  ORAL_WITH_TEXT: 'oral-with-text',
  ORAL_WITH_AUDIO: 'oral-with-audio',
};

export const QuestionGenMethod = {
  LISTEN_SELECT: genListenSelect,
  LISTEN_DETERMINE: genListenDetermine,
  ORAL_WITH_TEXT: genOralWithText,
  ORAL_WITH_AUDIO: genOralWithAudio,
};

export const QuestionName = {
  LISTEN_SELECT: '听力选择',
  LISTEN_DETERMINE: '听力判断',
  ORAL_WITH_TEXT: '口语复述',
  ORAL_WITH_AUDIO: '口语模仿朗读',
};

export const QuestionNameToType = {
  听力选择: 'LISTEN_SELECT',
  听力判断: 'LISTEN_DETERMINE',
  口语复述: 'ORAL_WITH_TEXT',
  口语模仿朗读: 'ORAL_WITH_AUDIO',
};
